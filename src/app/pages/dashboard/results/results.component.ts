import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Client } from 'src/app/core/models/Client';
import { ProductApiRequest } from 'src/app/core/models/ProductApiRequest';
import { RequestResult } from 'src/app/core/models/RequestResults';
import { ResultsService } from 'src/app/core/services/results.service';
import { UserService } from 'src/app/core/services/user.service';
import { saveAs as importedSaveAs } from "file-saver";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { environment } from 'src/environments/environment';
import { Utils } from 'src/app/core/utils/Utils';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  isAgent: Boolean = false;
  headers = ['Produit', 'Date d\'extraction', 'Durée d\'extraction', 'Statut', 'Résultats de requêtes'];

  products: Array<any> = [];

  requests: Array<ProductApiRequest> = []

  filteredRequests: Array<ProductApiRequest> = []

  filteredResults: Array<RequestResult> = []

  result!: RequestResult;

  isOpen = false;
  isLoading = true;

  page: number = 0;
  pageSize: number = 3;
  totalItems: number = 0;

  resourceUrl = environment.apiUrl + "/assets"


  constructor(private resultService: ResultsService, private userService: UserService, private _sanitizer: DomSanitizer, private utils: Utils) { }

  ngOnInit(): void {
    this.isAgent = this.utils.isAgent()

    if (this.isAgent) {
      this.userService.getAgentAccount().subscribe(
        (response: any) => {
          this.userService.getCustomerFromAgentAccount(response.client.accountId).subscribe(
            (response: Client) => {
              this.resultService.getRequestsByClient(response.id, this.page, this.pageSize).subscribe(
                response => {
                  this.totalItems = Number(response.headers.get('X-Total-Count')) ?? 0;
                  if (response?.body) {
                    response?.body.forEach(rq => {
                      rq.requestResult.fileUri = this._sanitizer.bypassSecurityTrustResourceUrl(`data:text/json;charset=UTF-8, ${JSON.stringify(rq.requestResult.jsonValue.jsonFinal)}`)
                    });
                    this.requests = response?.body
                    this.filteredRequests = response?.body
                  }
                  this.isLoading = false
                }
              )
              this.products = response.products;
            }, (err) => {
              alert(err.message)
            }
          )
        }
      )
    }
    else {
      this.userService.getCustomerFromUserAccount().subscribe(
        (response: Client) => {
          this.resultService.getRequestsByClient(response.id, this.page, this.pageSize).subscribe(
            response => {
              this.totalItems = Number(response.headers.get('X-Total-Count') )?? 0;
              if (response.body) {
                response.body.forEach(rq => {
                  rq.requestResult.fileUri = this._sanitizer.bypassSecurityTrustResourceUrl(`data:text/json;charset=UTF-8, ${JSON.stringify(rq.requestResult.jsonValue.jsonFinal)}`)
                });
                this.requests = response.body
                this.filteredRequests = response.body
              }
              this.isLoading = false
            }
          )
          this.products = response.products;
        }
      )

    }
  }

  changeModalState(value: boolean) {
    this.isOpen = value
  }

  viewResultDetail(result: RequestResult) {
    this.isOpen = true
    this.result = result
  }

  searchService(nom: string) {
    if (nom.length > 0) {
      const productRegex = new RegExp(`${nom.trim()}`, "ig")
      this.requests = this.requests.filter(r => r.requestResult.jsonValue.jsonFinal.search(productRegex) >= 0 || r.requestResult.jsonValue.jsonFinal.personal_infos.lastname.search(productRegex) >= 0)
    } else {
      this.ngOnInit()
    }
  }

  filterByService(service: string) {

    if (service === 'all') {
      this.filteredRequests = this.requests
    } else {
      this.filteredRequests = this.requests.filter(r => r.product?.id == service)
    }
  }

  downloadFile(data: any, type: any) {
    const blob = new Blob([data], { type: 'text/' + type });
    const today = Date.now().toString();
    importedSaveAs(blob, `Ganeyi_Requests_${today}`);
  }

  dataToCsv(data: any) {
    const replacer = (key: any, value: any) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    return csvArray
  }

  exportResult(value: any) {
    for (const req of this.filteredRequests) {
      if (req.requestResult.jsonValue.jsonFinal.personal_infos) {
        req.requestResult.jsonValue.jsonFinal.type = 'mrz';
        this.filteredResults.push(req.requestResult.jsonValue.jsonFinal.personal_infos)
      } else if (req.requestResult.jsonValue.jsonFinal.results && req.requestResult.jsonValue.jsonFinal.results.length > 0) {
        req.requestResult.jsonValue.jsonFinal.type = 'bank';
        this.filteredResults.push(req.requestResult.jsonValue.jsonFinal.results)
      } else {
        req.requestResult.jsonValue.jsonFinal.type = 'billing';
        this.filteredResults.push(req.requestResult.jsonValue.jsonFinal)
      }
    }

    const head = [['Date Extraction', 'Produit', 'Durée Extraction(ms)', 'Status']];
    const body: any[] = [];
    for (const res of this.filteredRequests) {
      const bdata = [res.requestDate, res.product.name, res.duration, res.status]
      body.push(bdata)
    }

    switch (value) {
      case 'pdf': {
        const doc = new jsPDF()
        autoTable(doc, { head, body })
        const today = Date.now().toString();
        doc.save(`Ganeyi_Requests_${today}.pdf`)
      } break;

      case 'csv': {
        const table = head.concat(body)
        const data = this.dataToCsv(table)
        this.downloadFile(data, 'csv')
      } break;

      case 'json': {
        const table = head.concat(body)
        this.downloadFile(JSON.stringify(table), 'json');
      } break;

      default:
        break;
    }

    // setTimeout(() => { location.reload() }, 2500);
  }

  onPageChange(page: any) {
    this.page = page
    this.ngOnInit()
  }

  onPageSizeChange(size: any) {
    this.pageSize = size
    this.ngOnInit()
  }

}
