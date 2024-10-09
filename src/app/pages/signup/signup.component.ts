import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from 'src/app/core/services/user.service';
import {AccountType} from 'src/app/core/utils/types';

interface SignUpResponse {
  details: string
  email: string
  accountId: string
  retry: number
  status: number
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  tooltip_status = false;
  password2: string = '';
  registerForm!: UntypedFormGroup;
  public showMsg = false;
  public loading = false;
  public subscribed = false;
  public isInputsValid = true;
  public isActivated = false;
  public showStrenght = false;
  public showPswd = false;

  public errorMsg = "";
  public try = 0;
  public inputErrorMsg = "Certains champs ne sont pas remplis correctement"
  @ViewChild('container') container!: ElementRef;

  passwordAnalysis = {
    lowerLetters: false,
    upperLetters: false,
    numbers: false,
    symbols: false,
    matched: false,
    length: false
  }

  constructor(private fb: UntypedFormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const activationCode = this.route.snapshot.paramMap.get('accountId');
    const queryParam = this.route.snapshot.queryParamMap.get('accountType');
    
    if (activationCode && queryParam) {
      const accountType: AccountType = <AccountType><unknown>queryParam;
      this.loading = true;
      this.userService.activateAccount(activationCode, accountType).subscribe(
        (isActivated) => {
          this.switchModal();
          this.isActivated = isActivated;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.errorMsg = error.slice(3, error.length);
          this.switchModal()
        }
      );
    }

    this.registerForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      companyName: [''],
      password2: ['', Validators.required],
    })
  }

  onSubmit() {
    this.try++
    this.verifyInputs()
    if (this.isInputsValid) {
      this.loading = true;
      this.userService.addCustomer(this.registerForm.value).subscribe({
        next: () => {
          this.subscribed = true;
        },
        error: (err) => {
          this.errorMsg = err;
          this.loading = false;
          this.switchModal();
        },
        complete: () => {
          this.loading = false;
          this.switchModal();
        }
      })
    }
  }

  verifyInputs() {
    this.isInputsValid = true;
    this.checkStrength(this.registerForm.value.password)
    if (this.registerForm.value.email.trim() === '') {
      this.isInputsValid = false;
      document.getElementById('email')?.classList.add('border-[red]')
      this.inputErrorMsg = "Certains champs ne sont pas remplis correctement"
    } else {
      document.getElementById('email')?.classList.remove('border-[red]')
    }

    if (this.registerForm.value.password.trim() === '') {
      this.isInputsValid = false;
      document.getElementById('password1')?.classList.add('border-[red]')
      document.getElementById('password2')?.classList.add('border-[red]')
      this.inputErrorMsg = "Certains champs ne sont pas remplis correctement"
    } else if (this.checkStrength(this.registerForm.value.password) < 30) {
      this.inputErrorMsg = "Le mot de passe doit contenir au moins une lettre majuscule, des lettres minuscules et un chiffre."
      this.isInputsValid = false
    } else if (this.registerForm.value.password2.trim() !== this.registerForm.value.password.trim()) {
      this.isInputsValid = false;
      document.getElementById('password1')?.classList.add('border-[red]')
      document.getElementById('password2')?.classList.add('border-[red]')
      this.inputErrorMsg = "Les mots de passe sont différents"
    } else {
      document.getElementById('password1')?.classList.remove('border-[red]')
      document.getElementById('password2')?.classList.remove('border-[red]')
      this.passwordAnalysis.matched = true
    }
    this.isInputsValid ? this.inputErrorMsg = "" : ""
  }

  switchModal() {
    this.showMsg = !this.showMsg
  }

  checkStrength(p: string) {
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
      passedMatches += flag ? 1 : 0;
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

  Strenght(password: any) {
    let i = 0;
    if (password.length >= 4) {
      i++;
    }
    if (password.length >= 8) {
      i++;
    }
    if (password.length >= 10) {
      i++;
    }
    if (/[A - Z]/.test(password)) {
      i++;
    }
    if (/[a - z]/.test(password)) {
      i++;
    }
    if (/[0 - 9]/.test(password)) {
      i++;
    }
    if (/[A-Za-z0-9]/.test(password)) {
      i++;
    }

    return i;
  }

  pswKeyUp() {
    this.showStrenght = true
    let password = this.container.nativeElement.querySelector("#password1").value;
    this.passwordAnalysis.length = password.length >= 8;
    this.passwordAnalysis.numbers = password.search(/\d/) > 0;
    this.passwordAnalysis.upperLetters = /[A-Z]/.test(password);
    this.passwordAnalysis.lowerLetters = /[a-z]/.test(password);

    let strenght = this.Strenght(password);
    if (strenght <= 2) {
      this.container.nativeElement.classList.add("weak");
      this.container.nativeElement.classList.remove("medium");
      this.container.nativeElement.classList.remove("strong");
    } else if (strenght >= 2 && strenght <= 4) {
      this.container.nativeElement.classList.remove("weak");
      this.container.nativeElement.classList.add("medium");
      this.container.nativeElement.classList.remove("strong");
    } else {
      this.container.nativeElement.classList.remove("weak");
      this.container.nativeElement.classList.remove("medium");
      this.container.nativeElement.classList.add("strong");
    }
  }

}
