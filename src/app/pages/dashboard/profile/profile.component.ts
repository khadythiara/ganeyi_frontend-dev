import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/core/models/Client';
import { User } from 'src/app/core/models/User';
import { Product } from 'src/app/core/models/Product';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils/Utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  isAgent: Boolean = false;
  public user!: Client;
  public client!: Client;
  public products: Product[] = [];
  public entreprise: any;
  
  constructor(private authenticationService: AuthenticationService, private userService: UserService, private utils: Utils) { }

  ngOnInit(): void {
    this.isAgent = this.utils.isAgent()

    if (this.isAgent) {
      this.userService.getAgentAccount().subscribe(
        (response: any) => {
          this.user = response
          this.userService.getCustomerFromAgentAccount(response.client.accountId).subscribe(
            (response: Client) => {
              this.products = response.products
              this.entreprise = response.companyName

            }, (err) => {
              alert(err.message)
            }
          )
        },
        (err) => { alert(err.message)}
      )
    }
    else {
      this.userService.getCustomerFromUserAccount().subscribe(
        (response: Client) => {
          this.user = response
          this.products = response.products
          this.entreprise = response.companyName
        }
      )
    }
  }
}
