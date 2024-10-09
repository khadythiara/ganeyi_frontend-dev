import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/core/models/Client';
import { ClipboardService } from 'ngx-clipboard';
import { ResultsService } from 'src/app/core/services/results.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils/Utils';

@Component({
  selector: 'app-license-keys',
  templateUrl: './license-keys.component.html',
  styleUrls: ['./license-keys.component.css']
})
export class LicenseKeysComponent implements OnInit {
  isAgent: Boolean = false;
  license: any;

  constructor(private resultService: ResultsService, private userService: UserService, private utils: Utils, private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    this.isAgent = this.utils.isAgent()
    if (this.isAgent) {
      this.userService.getAgentAccount().subscribe(
        (agent: any) => {
          this.userService.getCustomerFromAgentAccount(agent.client.accountId).subscribe(
            (client: Client) => {
              this.resultService.getLicensesByClient(client.id).subscribe(
                data => {
                  this.license = data;
                }
              )
            }
          )
        }
      )
    }
    else {
      this.userService.getCustomerFromUserAccount().subscribe(
        (response: Client) => {
          this.resultService.getLicensesByClient(response.id).subscribe(
            data => {
              this.license = data;
            }
          )
        }
      )
    }
  }

  isCopied = false;
  copyMessage(inputElement: any) {
    this.isCopied = true
    setTimeout(() => {
      this.isCopied = false
    }, 2000);
    this.clipboardApi.copyFromContent(inputElement)
  }

  getNumberOfDaysBeforeExpiration() {
    const days = this.utils.getDayDiff(this.license.endDate, this.license.startDate)
    return days;
  }

}
