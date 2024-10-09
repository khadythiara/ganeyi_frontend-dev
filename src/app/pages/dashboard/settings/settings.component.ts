import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/core/models/Client';
import { User } from 'src/app/core/models/User';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils/Utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  isAgent: Boolean = false;
  user!: Client;
  public createdDate!: Date;
  public loadingComponent = true;

  constructor(private authenticationService: AuthenticationService, private userService: UserService, private utils: Utils) { }

  ngOnInit(): void {
    this.isAgent = this.utils.isAgent()

    if (this.isAgent) {
      this.userService.getAgentAccount().subscribe(
        (response: any) => {
          this.user = response
          this.loadingComponent = false
          this.createdDate = response.createdTimestamp;
        },
        (err) => {
          alert(err.message)
          this.authenticationService.logout()
        }
      )
    }
    else {
      this.userService.getCustomerFromUserAccount().subscribe(
        (response: Client) => {
          this.user = response
          this.loadingComponent = false
        },
        () => {
          this.authenticationService.logout()
        }
      )

      this.userService.getUserAccount().subscribe(
        (response: any) => {
          this.createdDate = response.createdTimestamp;
        }
      )
    }

  }

}
