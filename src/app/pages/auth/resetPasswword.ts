import { Component } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        RippleModule,
        ToastModule,
    ],
    providers: [MessageService],
    template: `
    <p-toast></p-toast>

    <div
      class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen w-full overflow-hidden px-4"
    >
      <div
        class="flex flex-col items-center justify-center w-full sm:w-[480px] rounded-[56px] p-[0.3rem] bg-gradient-to-b from-primary to-transparent"
      >
        <div
          class="w-full bg-surface-0 dark:bg-surface-900 rounded-[53px] py-10 px-6 sm:px-10 shadow-lg"
        >
          <!-- Step 1: Email -->
          @if (step === 1) {
            <div class="text-center mb-8">
              <img src="/assets/logo.png" class="h-12 mx-auto mb-4" alt="Logo" />
              <span class="text-muted-color font-medium">
                Please enter your email address to receive the OTP
              </span>
            </div>

            <form [formGroup]="sendOtpForm" (ngSubmit)="sendOtp()">
              <label
                for="email"
                class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                >Email</label
              >
              <input
                pInputText
                id="email"
                type="email"
                formControlName="email"
                placeholder="Email address"
                class="w-full mb-2"
              />

              @if (email.invalid && (email.touched || email.dirty)) {
                <small class="text-red-500 block mb-4">
                  @if (email.errors?.['required']) { Email is required. }
                  @if (email.errors?.['email']) { Invalid email format. }
                </small>
              }

              <p-button
                label="Send OTP"
                styleClass="w-full"
                type="submit"
                [disabled]="sendOtpForm.invalid"
              ></p-button>
            </form>
          }

          <!-- Step 2: OTP + Password -->
          @if (step === 2) {
            <div class="text-center mb-8">
              <img src="/assets/logo.png" class="h-12 mx-auto mb-4" alt="Logo" />
              <span class="text-muted-color font-medium">
                Enter the OTP and your new password
              </span>
            </div>

            <form [formGroup]="resetPasswordForm" (ngSubmit)="resetPassword()">
              <!-- Email (readonly) -->
              <div class="mb-5">
                <label
                  for="email2"
                  class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                  >Email</label
                >
                <input
                  pInputText
                  id="email2"
                  type="email"
                  placeholder="Email address"
                  class="w-full"
                  formControlName="email"
                  readonly
                />
              </div>

              <!-- OTP -->
              <div class="mb-5">
                <label
                  for="otp"
                  class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                  >OTP</label
                >
                <input
                  pInputText
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP"
                  class="w-full"
                  formControlName="otp"
                />
                @if (otp.invalid && otp.touched) {
                  <small class="text-red-500 block mt-1">
                    @if (otp.errors?.['required']) { OTP is required. }
                    @if (otp.errors?.['minlength']) { OTP must be at least 4 digits. }
                  </small>
                }
              </div>

              <!-- Password -->
              <div class="mb-5">
                <label
                  for="password"
                  class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                  >New Password</label
                >
           
                            <p-password   id="password"
                  formControlName="password"
                  placeholder="New password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                @if (password.invalid && password.touched) {
                  <small class="text-red-500 block mt-1">
                    @if (password.errors?.['required']) { Password is required. }
                    @if (password.errors?.['minlength']) { Minimum 5 characters. }
                  </small>
                }
              </div>

              <!-- Confirm Password -->
              <div class="mb-8">
                <label
                  for="password_confirmation"
                  class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                  >Confirm Password</label
                >
          
                                            <p-password   id="password_confirmation"
                  formControlName="password_confirmation"
                  placeholder="Confirm password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>


                @if (password_confirmation.invalid && password_confirmation.touched) {
                  <small class="text-red-500 block mt-1">
                    @if (password_confirmation.errors?.['required']) {
                      Confirmation is required.
                    }
                    @if (password_confirmation.errors?.['minlength']) {
                      Minimum 5 characters.
                    }
                  </small>
                }

                @if (
                  resetPasswordForm.errors?.['passwordMismatch'] &&
                  password_confirmation.touched
                ) {
                  <small class="text-red-500 block mt-1">
                    Passwords do not match.
                  </small>
                }
              </div>

              <p-button
                label="Reset Password"
                styleClass="w-full"
                type="submit"
                [disabled]="resetPasswordForm.invalid"
              ></p-button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent {
    step = 1;

    constructor(
        private auth: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    // Step 1 form
    sendOtpForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    // Step 2 form
    resetPasswordForm = new FormGroup(
        {
            email: new FormControl('', [Validators.required, Validators.email]),
            otp: new FormControl('', [Validators.required, Validators.minLength(4)]),
            password: new FormControl('', [Validators.required, Validators.minLength(5)]),
            password_confirmation: new FormControl('', [
                Validators.required,
                Validators.minLength(5),
            ]),
        },
        { validators: [ResetPasswordComponent.passwordsMatchValidator] }
    );

    static passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
        const pass = group.get('password')?.value;
        const confirm = group.get('password_confirmation')?.value;
        return pass === confirm ? null : { passwordMismatch: true };
    }

    // Step 1: Send OTP
    sendOtp() {
        if (this.sendOtpForm.invalid) return;

        this.auth.sendOtp(this.sendOtpForm.value).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'OTP Sent',
                    detail: 'Check your email for the verification code.',
                });
                this.step = 2;
                this.resetPasswordForm.patchValue({
                    email: this.sendOtpForm.value.email,
                });
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failed to Send OTP',
                    detail: err?.error?.message || 'Something went wrong. Please try again.',
                });
            },
        });
    }

    // Step 2: Reset Password
    resetPassword() {
        if (this.resetPasswordForm.invalid) return;

        this.auth.resetPassword(this.resetPasswordForm.value).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Password Reset',
                    detail: 'Your password has been updated successfully!',
                });
                setTimeout(() => this.router.navigate(['/login']), 2000);
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Reset Failed',
                    detail: err?.error?.message || 'Unable to reset password. Try again later.',
                });
            },
        });
    }

    // Getters for template access
    get email() {
        return this.sendOtpForm.get('email')!;
    }
    get otp() {
        return this.resetPasswordForm.get('otp')!;
    }
    get password() {
        return this.resetPasswordForm.get('password')!;
    }
    get password_confirmation() {
        return this.resetPasswordForm.get('password_confirmation')!;
    }
}
