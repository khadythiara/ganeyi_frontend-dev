import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private router: Router,
    private userService: UserService
  ) {
    //
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.forgotPasswordForm?.invalid) {
      return;
    }

    this.loading = true;
    this.userService.forgotPassword(this.f['email'].value)
      .pipe(first())
      .subscribe({
        next: response => {
          this.submitted = true;
          this.successMessage = `Un email vous a été envoyé à l'adresse ${this.f['email'].value} pour réinitialiser votre mot de passe.`;
        },
        error: error => {
          switch (error.status) {
            case 0:
              this.error = 'Erreur: Veuillez vérifier votre connexion ou réessayer plus tard'
              break;

            case 408:
              this.error = "Timeout ! Veuillez réessayer."
              break;

            case 500:
              this.error = "Erreur serveur: Veuillez réessayer plus tard."
              break;

            default:
              this.error = error.message ? error.message : error.slice(3, error.length);
              break;
          }
          this.loading = false;
        }
      });
  }

}
