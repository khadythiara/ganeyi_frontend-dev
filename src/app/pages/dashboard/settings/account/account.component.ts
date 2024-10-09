import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/core/models/Client';
import { User } from 'src/app/core/models/User';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/core/utils/Utils';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  selectEvent($event: Event) {
    throw new Error('Method not implemented.');
  }
  onChangeSearch($event: Event) {
    throw new Error('Method not implemented.');
  }
  onFocused($event: Event) {
    throw new Error('Method not implemented.');
  }
  isAgent: Boolean = false;
  public loading = false;
  public error = true;
  public account!: User;
  public user!: any;
  public agent!: any;

  changeInfosForm!: FormGroup;
  public infoUpdated = ''

  constructor(private authenticationService: AuthenticationService, private fb: UntypedFormBuilder, private userService: UserService, private utils: Utils) { }

  ngOnInit(): void {
    this.isAgent = this.utils.isAgent()

    if (this.isAgent) {
      this.userService.getAgentAccount().subscribe(
        (response: any) => {

          this.user = response
          
          this.changeInfosForm = this.fb.group({
            id: [this.user.id],
            firstName: [this.user.firstName, [Validators.required]],
            lastName: [this.user.lastName, [Validators.required]],
            phoneNumber: [this.user.phoneNumber, [Validators.required]],            
            clientId: [this.user.client.id, [Validators.required]],
            accountId: [this.user.accountId, [Validators.required]],
            email: [this.user.email, [Validators.required]],

            isActive: [this.user.isActive, [Validators.required]],
            address: [this.user.address, []],
            city: [this.user.city, []],
            country: [this.user.country, []]
          })
        },
        (err) => {
          alert(err.message)
        }
      )
    }
    else {

      this.userService.getCustomerFromUserAccount().subscribe(
        (response: Client) => {
          this.user = response
          this.changeInfosForm = this.fb.group({
            id: [this.user.id],
            firstName: [this.user.firstName, [Validators.required]],
            lastName: [this.user.lastName, [Validators.required]],
            address: [this.user.address, [Validators.required]],
            phoneNumber: [this.user.phoneNumber, [Validators.required]],
            city: [this.user.city, []],
            country: [this.user.country, [Validators.required]]
          })
        }
      )
    }
  }

  submitNewInfos() {
    this.loading = true;
    if (this.isAgent) {
      this.userService.updateAgent(this.changeInfosForm.value, this.user.id).subscribe(() => {
        this.infoUpdated = 'personal-info'
        this.loading = false;
        this.error = false;
        setTimeout(() => {
          location.reload()
        }, 2000);
      },
        () => {
          this.loading = false;
          this.error = true;
        })

    } else {
      this.userService.changePersonalInfo(this.changeInfosForm.value, this.user.id).subscribe(() => {
        this.infoUpdated = 'personal-info'
        this.loading = false;
        this.error = false;
        setTimeout(() => {
          location.reload()
        }, 2000);
      },
        () => {
          this.loading = false;
          this.error = true;
        })
    }
  }
}
