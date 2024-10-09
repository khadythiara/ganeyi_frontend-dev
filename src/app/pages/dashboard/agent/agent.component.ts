import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Client } from 'src/app/core/models/Client';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {
  @ViewChild('firstName') firstName: any;
  @ViewChild('lastName') lastName: any;
  @ViewChild('email') email: any;
  @ViewChild('phoneNumber') phoneNumber: any;

  public isLoading: boolean = false;
  public loadingComponent: boolean = true;
  public createLoader: boolean = false;
  public updateLoader: boolean = false;
  public removeLoader: boolean = false;
  public isAccountActive = false;
  public isInputsValid = true;
  public newAgentForm!: UntypedFormGroup;
  public updateAgentForm!: UntypedFormGroup;
  public toggleAgentForm!: UntypedFormGroup;
  public editModal = false;
  public deleteModal = false;
  public user!: Client;
  public agents!: any;
  public agentIdToDelete !: any;
  public agentToUpdate !: any;
  public try = 0;
  public error = '';
  public success = '';
  public errorModal = '';
  public successModal = '';
  public mailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  constructor(public fb: UntypedFormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.loadingComponent = true
    this.userService.getCustomerFromUserAccount().subscribe(
      (response: Client) => {
        this.user = response
        this.isAccountActive = response.isActive
        this.userService.getClientAgents(response.id).subscribe(
          (res: any) => {
            this.agents = res
          }
        )
        this.loadingComponent = false
      }, () => this.loadingComponent = false
    )

    this.newAgentForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      email: [''],
      clientId: ['']
    })

    this.toggleAgentForm = this.fb.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      clientId: [''],
      accountId: [''],
      email: [''],
      isActive: [''],
    })

    this.updateAgentForm = this.fb.group({
      id: [],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      clientId: [''],
      accountId: [''],
      email: [''],
      isActive: [''],

    })
  }

  createNewAgent() {
    this.try++
    this.verifyInputs()
    this.createLoader = true
    if (this.isInputsValid) {
      this.newAgentForm.value.clientId = this.user.id
      this.userService.createAgent(this.newAgentForm.value).subscribe(
        (res) => {
          this.agents.push(res.body)
          this.success = "Agent créé avec succès !"
          this.createLoader = false
          this.firstName.nativeElement.value = ' ';
          this.lastName.nativeElement.value = ' ';
          this.email.nativeElement.value = ' ';
          this.phoneNumber.nativeElement.value = ' ';
          this.newAgentForm.value.firstName = ""
          this.newAgentForm.value.lastName = ""
          this.newAgentForm.value.email = ""
          this.newAgentForm.value.phoneNumber = ""
          setTimeout(() => {
            this.success = ""
          }, 3000);
        }, (err: any) => {
          this.error = err
          this.createLoader = false
        }
      )
    }
    else {
      this.createLoader = false
    }
  }

  updateAgent() {
    this.updateLoader = true
    if (this.agentToUpdate !== null) {

      this.updateAgentForm.value.clientId = this.user.id
      this.updateAgentForm.value.id = this.agentToUpdate.id
      this.updateAgentForm.value.accountId = this.agentToUpdate.accountId
      this.updateAgentForm.value.email = this.agentToUpdate.email
      this.updateAgentForm.value.isActive = this.agentToUpdate.isActive
      this.userService.updateAgent(this.updateAgentForm.value, this.agentToUpdate.id).subscribe(
        (res) => {
          this.errorModal = ""
          let foundIndex = this.agents.indexOf(this.agentToUpdate);
          this.agents[foundIndex] = res.body;
          this.successModal = "Agent modifié avec succès !"
          this.updateLoader = false
          setTimeout(() => {
            this.successModal = ""
            this.editModal = !this.editModal;
          }, 2000);
        }, (err) => {
          this.errorModal = err.message
          this.updateLoader = false
        }
      )
    }
    else {
      this.updateLoader = false
    }
  }

  deleteAgent() {
    this.removeLoader = true
    if (this.agentIdToDelete !== null) {
      this.userService.deleteAgent(this.agentIdToDelete).subscribe(
        () => {
          let agent = this.agents.find((a: any) => a.id === this.agentIdToDelete)
          this.agents.splice(this.agents.indexOf(agent, 0), 1);
          this.successModal = "Agent supprimé avec succès !"
          this.removeLoader = false
          setTimeout(() => {
            this.successModal = ""
            this.deleteModal = !this.deleteModal;
          }, 2000);
        }, (err) => {
          this.errorModal = err.message
          this.removeLoader = false
        }
      )
    }
    else {
      this.removeLoader = false
    }
  }

  toggleDeleteModal(agent: any) {
    this.deleteModal = !this.deleteModal;
    this.agentIdToDelete = agent.id;
  }

  toggleEditModal(agent: any) {
    this.editModal = !this.editModal;
    this.agentToUpdate = agent;
    this.updateAgentForm.get('firstName')?.setValue(this.agentToUpdate.firstName)
    this.updateAgentForm.get('lastName')?.setValue(this.agentToUpdate.lastName)
    this.updateAgentForm.get('phoneNumber')?.setValue(this.agentToUpdate.phoneNumber)
  }

  toggleAgentAccount(agent: any, event: any) {
    this.agentToUpdate = agent;
    this.toggleAgentForm.get('isActive')?.setValue(!this.agentToUpdate.isActive)

    this.toggleAgentForm.value.clientId = this.user.id
    this.toggleAgentForm.value.id = this.agentToUpdate.id
    this.toggleAgentForm.value.accountId = this.agentToUpdate.accountId
    this.toggleAgentForm.value.email = this.agentToUpdate.email
    this.toggleAgentForm.value.phoneNumber = this.agentToUpdate.phoneNumber
    this.toggleAgentForm.value.firstName = this.agentToUpdate.firstName
    this.toggleAgentForm.value.lastName = this.agentToUpdate.lastName

    this.userService.updateAgentStatus(this.toggleAgentForm.value, this.agentToUpdate.id).subscribe((res) => {
      this.agents[this.agents.findIndex((agent: any) => this.agentToUpdate === agent)] = res.body
    })
  }

  verifyInputs() {
    this.isInputsValid = true;

    if (this.newAgentForm.value.lastName.trim() === '') {
      this.isInputsValid = false;
      document.getElementById('lastName')?.classList.remove('border-gray-300')
      document.getElementById('lastName')?.classList.add('border-[red]')
      this.error = "Veuillez renseigner un nom."
    }
    else {
      document.getElementById('lastName')?.classList.add('border-gray-300')
      document.getElementById('lastName')?.classList.remove('border-[red]')
    }

    if (this.newAgentForm.value.firstName.trim() === '') {
      this.isInputsValid = false;
      document.getElementById('firstName')?.classList.remove('border-gray-300')
      document.getElementById('firstName')?.classList.add('border-[red]')
      this.error = "Veuillez renseigner un prénom."
    }
    else {
      document.getElementById('firstName')?.classList.add('border-gray-300')
      document.getElementById('firstName')?.classList.remove('border-[red]')
    }

    if (!this.phonenumber(this.newAgentForm.value.phoneNumber.trim())) {
      this.isInputsValid = false;
      document.getElementById('phone')?.classList.remove('border-gray-300')
      document.getElementById('phone')?.classList.add('border-[red]')
      this.error = "Veuillez renseigner un numéro de téléphone correct. Ex: +221 776665544 ou 781112233."

    }
    else {
      document.getElementById('phone')?.classList.add('border-gray-300')
      document.getElementById('phone')?.classList.remove('border-[red]')
    }

    if (!this.mailRegex.test(this.newAgentForm.value.email)) {
      this.isInputsValid = false;
      document.getElementById('email')?.classList.add('border-[red]')
      document.getElementById('email')?.classList.remove('border-gray-300')
      this.error = "Veuillez renseigner une adresse mail correcte."
    }
    else {
      document.getElementById('email')?.classList.add('border-gray-300')
      document.getElementById('email')?.classList.remove('border-[red]')
    }

    this.isInputsValid ? this.error = "" : ""
  }

  phonenumber(inputtxt: any) {
    let phoneno = /^\+?\s*\d{3}\s*\d{3}\s*\d{3,6}$|^\+?\d{9,12}$/;
    if (inputtxt.trim().match(phoneno))
      return true;
    else
      return false;
  }

}
