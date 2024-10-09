import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/core/models/Client';
import { UserService } from 'src/app/core/services/user.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  public loading = false;
  user!: Client;
  isPasswordSame = false;
  isInputsValid = false;
  isPasswordValid = false;
  changePasswordMsg = '';
  hasError = false;
  isSubmitted = false;

  changePasswordForm!: UntypedFormGroup;
  public infoUpdated = ''

  constructor(private fb: UntypedFormBuilder, private authenticationService: AuthenticationService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', []],
      newPassword: ['', []],
      confirmPassword: ['', []]
    })
  }

  verifyPasswordForm() {
    this.isInputsValid = true;

    if (this.changePasswordForm.value.oldPassword.trim() === '') {
      this.isInputsValid = false;
      this.hasError = true;
      document.getElementById('old-password')?.classList.add('border-[red]', 'focus:border-[red]')
    }
    else {
      document.getElementById('old-password')?.classList.remove('border-[red]', 'focus:border-[red]')
    }

    if (this.changePasswordForm.value.newPassword.trim() === '') {
      this.isInputsValid = false;
      this.hasError = true;
      document.getElementById('new-password')?.classList.add('border-[red]', 'focus:border-[red]')
    }
    else {
      document.getElementById('new-password')?.classList.remove('border-[red]', 'focus:border-[red]')
    }

    if (this.changePasswordForm.value.confirmPassword.trim() === '') {
      this.isInputsValid = false;
      this.hasError = true;
      document.getElementById('confirm-password')?.classList.add('border-[red]', 'focus:border-[red]')
    }
    else {
      document.getElementById('confirm-password')?.classList.remove('border-[red]', 'focus:border-[red]')
    }
    this.enablePasswordButton()
  }

  checkNewPassword() {
    this.verifyPasswordForm()
    this.isPasswordValid = true

    if (this.changePasswordForm.value.newPassword.trim() !== this.changePasswordForm.value.confirmPassword.trim()) {
      this.changePasswordMsg = "Vos mots de passe ne sont pas identiques"
      this.isPasswordValid = false
      this.hasError = true;
      document.getElementById('new-password')?.classList.add('border-[red]', 'focus:border-[red]')
      document.getElementById('confirm-password')?.classList.add('border-[red]', 'focus:border-[red]')

    }
    else if (checkStrength(this.changePasswordForm.value.newPassword) < 30) {
      this.changePasswordMsg = "Le mot de passe doit contenir au moins 1 lettre majuscule, des lettre minuscule et 1 chiffre"
      this.isPasswordValid = false
      this.hasError = true;
      document.getElementById('new-password')?.classList.add('border-[red]', 'focus:border-[red]')
      document.getElementById('confirm-password')?.classList.add('border-[red]', 'focus:border-[red]')
    }
    else {
      this.isPasswordValid = true
      this.changePasswordMsg = ""
      document.getElementById('confirm-password')?.classList.remove('border-[red]', 'focus:border-[red]')
      document.getElementById('new-password')?.classList.remove('border-[red]', 'focus:border-[red]')
    }
    this.enablePasswordButton()
  }

  enablePasswordButton() {
    let changePassworbtn = document.getElementById('change-password-btn') as HTMLButtonElement
    this.isInputsValid && this.isPasswordValid ? changePassworbtn.disabled = false : changePassworbtn.disabled = true
  }

  logout() {
    this.authenticationService.logout()
    this.infoUpdated = ''
  }

  submitNewPassword() {
    this.verifyPasswordForm()
    this.loading = true;
    this.isSubmitted = true;
    this.userService.changePassword(this.changePasswordForm.value).subscribe((response) => {
      if (response.status === 200) {
        this.changePasswordMsg = "Votre mot de passe a bien été changé !"
        this.infoUpdated = 'password'
        this.hasError = false;
      }
      else {
        this.changePasswordMsg = "Votre mot de passe n'a peut être pas été changé !"
        this.hasError = true
      }
      this.loading = false;

    },
      (err) => {
        this.loading = false;
        this.changePasswordMsg = "Quelque chose s'est mal passé !"
      })
  }

}

function checkStrength(p: string) {
  // 1
  let force = 0;

  // 2
  const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
  const lowerLetters = /[a-z]+/.test(p);
  const upperLetters = /[A-Z]+/.test(p);
  const numbers = /[0-9]+/.test(p);
  const symbols = regex.test(p);

  // 3
  const flags = [lowerLetters, upperLetters, numbers, symbols];

  // 4
  let passedMatches = 0;
  for (const flag of flags) {
    passedMatches += flag === true ? 1 : 0;
  }

  // 5
  force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
  force += passedMatches * 10;

  // 6
  force = (p.length <= 6) ? Math.min(force, 10) : force;

  // 7
  force = (passedMatches === 1) ? Math.min(force, 10) : force;
  force = (passedMatches === 2) ? Math.min(force, 20) : force;
  force = (passedMatches === 3) ? Math.min(force, 30) : force;
  force = (passedMatches === 4) ? Math.min(force, 40) : force;

  return force;
}