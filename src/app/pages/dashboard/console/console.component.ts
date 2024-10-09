import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/core/models/Client';
import { Product } from 'src/app/core/models/Product';
import { ProductApi } from 'src/app/core/models/ProductApi';
import { ProductService } from 'src/app/core/services/product.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { Utils } from 'src/app/core/utils/Utils';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {
  isAccountActive = false;

  products: Product[] = [];

  isLoading: boolean = false;
  requestResponse: boolean = false;
  requestMessage: string = "";
  errorDescription: string = "";

  customer!: Client;
  agent!: any;
  isAgent: Boolean = false;

  public loadingComponent = true;

  selectedProduct!: Product;
  productLicense!: any;
  selectedApi!: ProductApi;
  selectedFile!: File[];
  imageSrc!: any;

  queryParam: any = null;

  public form!: UntypedFormGroup;

  resourceUrl = environment.apiUrl + '/assets';
  resultId: any;
  responseStatus: string = "";
  showMsg: boolean = false;

  try: number = 0;
  constructor(public fb: UntypedFormBuilder, private router: Router, private route: ActivatedRoute, private productService: ProductService, private userService: UserService, private utils: Utils) {
  }

  ngOnInit(): void {
    this.isAgent = this.utils.isAgent()
    this.form = this.fb.group({
      product: [''],
      files: [null],
      version: ['1'],
      key: ['L9x91BKu24adD'],
      api: ['']
    })

    this.queryParam = this.route.snapshot.queryParamMap.get('prod');

    if (this.isAgent) {
      this.userService.getAgentAccount().subscribe(
        (response: any) => {
          response.isActive ? this.isAccountActive = true : this.isAccountActive = false
          this.userService.getCustomerFromAgentAccount(response.client.accountId).subscribe(
            (response: Client) => {
              this.customer = response;
              this.products = response.products;
              if (this.queryParam != null) {
                const produit = (response.products.filter(item => item.id === this.queryParam))[0];
                this.selectProduct(produit);
              }
              this.loadingComponent = false;
            }
          )
        }
      )
    }
    else {
      this.userService.getCustomerFromUserAccount().subscribe(
        (response: Client) => {
          this.customer = response;
          this.customer.products.length === 1 ? this.selectProduct(this.customer.products[0]) : ""
          this.customer.isActive ? this.isAccountActive = true : this.isAccountActive = false
          this.products = response.products;
          if (this.queryParam != null) {
            const produit = (response.products.filter(item => item.id === this.queryParam))[0];            
            this.selectProduct(produit);
          }
          this.loadingComponent = false;
        }
      )
    }
  }

  getLicense() {
    this.productService.getProductLicense(this.selectedProduct.id, this.customer.id).subscribe(
      (data) => {
        this.productLicense = data;
      }, error => {
        // TODO: Error handler
      }
    )
  }

  selectProduct(product: Product) {
    console.log(product);
    
    this.selectedProduct = product;
    this.form.controls['product'].patchValue([product.name]);
    this.form.get('product')!.updateValueAndValidity();
    /** To delete with a versions list !! */
    this.selectedApi = product.productApis[0];
    this.form.controls['product'].patchValue([product.productApis[0].version]);
    this.form.get('api')!.updateValueAndValidity();
    this.getLicense();
    /** Fin */
  }

  selectApi(api: ProductApi) {
    this.selectedApi = api;
    this.form.controls['product'].patchValue([api.version]);
    this.form.get('api')!.updateValueAndValidity();
    this.getLicense()
  }

  selectFileToUpload(event: any) {
    this.selectedFile = event.target ? event.target.files : event ;
    const files = event.target ? event.target.files : event ;
    this.form.controls['files'].patchValue([files]);
    this.form.get('files')!.updateValueAndValidity();
    this.readURL(this.selectedFile);
  }

  checkInput(){
    if (this.try !== 0){
      if (this.selectedFile && this.selectedProduct) {
        
        (document.getElementById("products-list") as HTMLElement).style.boxShadow = "0px 0px 0px red";
        (document.getElementById("file-input") as HTMLElement).style.boxShadow = "0px 0px 0px red";
        return true
      }
      else{
        if (!this.selectedProduct) {
          (document.getElementById("products-list") as HTMLElement).style.boxShadow = "0px 0px 5px red"
        }
        else{
          (document.getElementById("products-list") as HTMLElement).style.boxShadow = "0px 0px 0px red"
        }
        if (!this.selectedFile) {
          (document.getElementById("file-input") as HTMLElement).style.boxShadow = "0px 0px 5px red"
        }
        else{
          (document.getElementById("file-input") as HTMLElement).style.boxShadow = "0px 0px 0px red"
        }
        return false
      }

    }
    else return false
  }

  sendRequest() {
    this.try ++
    if (this.checkInput()) {
      
    this.isLoading = true;
    let payload = new FormData();
    console.log(this.form.controls);
    
    Object.keys(this.form.controls).forEach(formControlName => {
      payload.append(formControlName, this.form.get(formControlName)!.value);
    });

    console.log(payload);
    let errorMessage = "Une erreur s'est produite lors du traitement de vos données. Veuillez vérifier le fichier chargé ou réessayer plus tard";

    this.productService.sendRequest(this.selectedFile, this.selectedProduct.name, this.selectedApi.version, this.productLicense.accessKey).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.responseStatus = response.status;
        if (response.status === 'SUCCESS') {
          this.requestMessage = 'Traitement effectué avec succès!';
        } else {
          if (response.requestResult.jsonValue.jsonFinal.error)
            this.requestMessage = response.requestResult.jsonValue.jsonFinal.error;
          else
            this.requestMessage = errorMessage;
        }
        this.requestResponse = true
        this.resultId = response.id;
        this.switchModal()
      },
      error => {
        // TODO: Error handler
        this.isLoading = false;
        this.requestResponse = true;
        this.requestMessage = errorMessage;
        this.errorDescription = error != "OK" ? error : "API not found";
        this.switchModal()
      }
    )
    }
  }

  readURL(files: File[]): void {
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;
        reader.readAsDataURL(files[i]);
      }
    }
  }

  isPdf(name: string) {
    return name.includes("pdf");
  }

  switchModal() {
    this.showMsg = !this.showMsg
  }

  reloadPage() { location.reload() }

}
