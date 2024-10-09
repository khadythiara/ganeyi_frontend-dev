import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { MessageService } from 'primeng/api';
import { Client } from 'src/app/core/models/Client';
import { Product } from 'src/app/core/models/Product';
import { ProductService } from 'src/app/core/services/product.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  providers: [MessageService]
})
export class ProductsListComponent implements OnInit {
  isAccountActive = false;
  public loadingComponent = true;
  headers = ['Logo', 'Nom', 'Description', 'Statut', 'Actions'];

  products: Product[] = [];

  customer!: Client;

  openCreationModalForm = false;

  showAlert = false;

  isLoading = false;

  oneProduct!: Product;

  subscribedProduct!: Product;
  subscriptionMessage!: string;

  resourceUrl = environment.apiUrl + "/assets";

  alert: any = {
    type: 'green',
    title: 'Alert Title',
    body: 'Alert message'
  };
  openModal: boolean = false;

  mySelectedValue: any;

  filteredProducts: Product[] = [];

  constructor(private messageService: MessageService, private productService: ProductService, private userService: UserService, private toast: NgToastService) {
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      response => {
        this.products = response;
        this.products.forEach(product => {
          product.description === null ? product.description = [""] : product.description = product.description.split(",")
          product.description.length > 5 ? product.description.splice(4, product.description.length - 4) : ""
        }
        );
        this.productSelected = response;
        this.loadingComponent = false;
      }
    )

    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });

    this.userService.getCustomerFromUserAccount().subscribe(
      (response: Client) => {
        this.customer = response;
        this.isAccountActive = this.customer.isActive;
        this.loadingComponent = false;
      },
      error => {
        this.isAccountActive = false;
      }
    )

  }

  closeCreationForm() {
    this.openCreationModalForm = false;
  }


  maxInput: number = this.products.length - 1
  productSelected: Product[] | undefined = this.products

  searchProduct(nom: string) {
    if (nom.length > 0) {
      const productRegex = new RegExp(`${nom.trim()}`, "ig")
      this.products = this.products.filter(product => product.name.search(productRegex) >= 0)
    } else {
      if (this.mySelectedValue == "1") {
        this.products = this.filteredProducts;
      } else {
        this.ngOnInit()
      }
    }
  }

  subscribeToProduct(product: Product) {
    this.isLoading = true;
    this.subscribedProduct = product
    this.productService.subscription(this.customer, product.id).subscribe({
      next: () => {
        this.switchModal();
        this.isLoading = false;
        this.subscriptionMessage = `Souscription au produit ${product.name.toUpperCase()} effectuée avec succès !`
      },
      error: () => {
        this.isLoading = false;
        this.subscriptionMessage = `Erreur lors de la souscription au produit ${product.name.toUpperCase()} ! Veuillez réessayer ultérieurement.`
      }
    })
  }

  reloadPage() {
    location.reload()
  }

  switchModal() {
    this.showAlert = !this.showAlert
  }

  isAlreadySubscribe(productId: any) {
    return this.customer ? this.customer.products.find(p => p.id === productId) : null;
  }

  openMymodal(product: Product) {
    this.oneProduct = product;
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  filterProducts(value: string) {
    this.mySelectedValue = value;
    if (value == "1") {
      this.products = this.products.filter(p => this.isAlreadySubscribe(p.id));
      this.filteredProducts = this.products;
    } else {
      this.ngOnInit();
    }
  }

}
