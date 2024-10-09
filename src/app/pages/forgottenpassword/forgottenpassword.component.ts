import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-forgottenpassword',
  templateUrl: './forgottenpassword.component.html',
  styleUrls: ['./forgottenpassword.component.css']
})
export class ForgottenpasswordComponent implements OnInit {

  public loading = false;
  resetPasswordForm!: UntypedFormGroup;
  public showMsg = false;
  public isRequestSent = false
  public isInputsValid = false
  public isPasswordSame = false;
  public isPasswordValid = false;
  public changePasswordMsg = '';
  constructor(private fb: UntypedFormBuilder, private userService: UserService,) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      newPassword: ['', []],
      confirmPassword: ['', []]
    })
    this.verifyInputs()

  }

  submitNewPassword() {
    this.loading = true;
    this.userService.resetForgottentPassword(this.resetPasswordForm.value).subscribe((response) => {
      if (response.status === 201) {
        this.isRequestSent = true
      }
      this.loading = false;
    },
      () => {
        this.loading = false;
      })
    this.switchModal()
  }

  verifyInputs() {
    this.isInputsValid = true;

    if (this.resetPasswordForm.value.email.trim() === '') {
      this.isInputsValid = false;
      document.getElementById('email')?.classList.add('border-[red]')
    }
    else {
      document.getElementById('email')?.classList.remove('border-[red]')
    }

    if (this.resetPasswordForm.value.newPassword.trim() === '') {
      this.isInputsValid = false;
      document.getElementById('new-password')?.classList.add('border-[red]')
    }
    else {
      document.getElementById('new-password')?.classList.remove('border-[red]')
    }

    if (this.resetPasswordForm.value.confirmPassword.trim() === '') {
      this.isInputsValid = false;
      document.getElementById('confirm-password')?.classList.add('border-[red]')
    }
    else {
      document.getElementById('confirm-password')?.classList.remove('border-[red]')
    }
  }

  checkNewPassword() {
    this.isPasswordValid = true

    if (this.resetPasswordForm.value.newPassword.trim() !== this.resetPasswordForm.value.confirmPassword.trim()) {
      this.changePasswordMsg = "Vos mots de passe ne sont pas identiques"
      this.isPasswordValid = false

    }
    else if (checkStrength(this.resetPasswordForm.value.newPassword) < 30) {
      this.changePasswordMsg = "Le mot de passe doit contenir au moins une lettre majuscule, des lettres minuscules et un chiffre."
      this.isPasswordValid = false
    }
    else {
      this.isPasswordValid = true
      this.changePasswordMsg = ""
    }
    this.enablePasswordButton()
  }

  switchModal() {
    this.showMsg = !this.showMsg
  }

  enablePasswordButton() {
    let btn = document.getElementById('reset-password-btn') as HTMLButtonElement
    this.isInputsValid && this.isPasswordValid ? btn.disabled = false : btn.disabled = true
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