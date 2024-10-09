import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/core/models/Client';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils/Utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  openUserMenu: boolean = false;
  user!: Client;
  public loadingComponent = true;
  isAgent: Boolean = false;
  hasSubscription: Boolean = false;

  constructor(private authenticationService: AuthenticationService, private userService: UserService, private utils: Utils, private router: Router) { }

  ngOnInit(): void {
    this.isAgent = this.utils.isAgent()
    if (this.isAgent) {
      this.userService.getAgentAccount().subscribe(
        (response: any) => {
          this.user = response
          this.loadingComponent = false;
        },
        () => {
          this.logout()
        }
      )
    }
    else {
      this.userService.getCustomerFromUserAccount().subscribe(
        (response: Client) => {
          this.user = response
          this.loadingComponent = false;
          if (response.products.length > 0) this.hasSubscription = true
        },
        () => {
          this.logout()
        }
      )
    }
  }

  toggleOpenUserMenu() {
    this.openUserMenu = !this.openUserMenu
  }

  logout() {
    this.authenticationService.logout()
  }

}
