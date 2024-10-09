import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProductApiRequest } from 'src/app/core/models/ProductApiRequest';
import { ResultsService } from 'src/app/core/services/results.service';
import { saveAs as importedSaveAs } from "file-saver";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import * as json2csv from 'json2csv';

@Component({
  selector: 'app-request-result',
  templateUrl: './request-result.component.html',
  styleUrls: ['./request-result.component.css']
})
export class RequestResultComponent implements OnInit {

  Json2csvParser = json2csv.Parser;

  requestId!: string | null;
  request!: ProductApiRequest;
  dataToExport: any = null;
  bankData: any = {
    operations: [],
    filteredOperations: [],
    filteredKeys: [],
    infos: {}
  };

  constructor(private _sanitizer: DomSanitizer, private route: ActivatedRoute, private resultService: ResultsService) {
  }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.resultService.getRequestsById(this.requestId).subscribe(
      data => {
        this.request = data;
        if (data.requestResult.jsonValue.jsonFinal.tables == null) {
          if (data.requestResult.jsonValue.jsonFinal.bill_infos != null) {
            data.requestResult.jsonValue.jsonFinal.type = 'billing'
          } else {
            data.requestResult.jsonValue.jsonFinal.type = 'ocr'
          }
        } else {
          data.requestResult.jsonValue.jsonFinal.type = 'bank'
          const keys: any[] = [];
          Object.entries(data.requestResult.jsonValue.jsonFinal.tables).forEach(([key, value]) => {
            const valeur: any = value;
            this.bankData.operations[key] = [];
            keys.push(key);
            Object.entries(valeur).forEach(([k, v]) => {
              this.bankData.operations[key].push(v);
            })
          })
          this.bankData.filteredKeys = keys;
          for (let index = 0; index < this.bankData.operations[keys[0]].length; index++) {
            const vals = []
            for (const k of keys) {
              vals.push(this.bankData.operations[k][index])
            }
            this.bankData.filteredOperations.push(vals)
          }
          this.bankData.totaux = keys;
        }
      },
      error => {
        // TODO: Error handler
      }
    )
  }

  downloadFile(data: any, type: any) {
    const today = Date.now().toString();
    const blob = new Blob([data], { type: 'text/' + type });
    importedSaveAs(blob, `${today}_Ganeyi_result_${this.request.product.name}`);
  }

  dataToCsv(data: any) {
    let json2csvParser = new this.Json2csvParser();
    let csv = json2csvParser.parse(data);
    return csv
  }

  exportResult(value: any) {

    const today = Date.now().toString();

    switch (value) {
      case 'pdf': {
        const doc = new jsPDF()
        autoTable(doc, { html: '#jstable' })
        doc.save(`${today}_Ganeyi_result_${this.request.product.name}.pdf`)
      }
        break;

      case 'csv': {
        let data;
        if (this.request.requestResult.jsonValue.jsonFinal.type == 'bank') {
          data = this.dataToCsv(this.bankData.filteredOperations)
        } else {
          data = this.dataToCsv(this.dataToExport)
        }
        this.downloadFile(data, 'csv')
      }
        break;

      case 'json': {
        let data;
        if (this.request.requestResult.jsonValue.jsonFinal.type == 'bank') {
          data = this.bankData.filteredOperations
        } else {
          data = this.dataToExport
        }
        this.downloadFile(JSON.stringify(data), 'json');
      }
        break;

      default:
        break;
    }
  }

  public retrieveBase64Image(image: any) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(image)
  }

}
