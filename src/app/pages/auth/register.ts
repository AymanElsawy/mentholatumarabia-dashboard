import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, RouterModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, RippleModule],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33,150,243,0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-10 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="/assets/logo.png" class="h-12 block mx-auto" alt="Logo" />
                            <span class="text-muted-color font-medium mt-5 block text-lg">Welcome to Mentholatum</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Register {
    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    registerForm = new FormGroup(
        {
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(5)]),
            password_confirmation: new FormControl('', [Validators.required, Validators.minLength(5)])
        },
        { validators: [Register.passwordsMatchValidator] }
    );

    // ✅ Custom password match validator
    static passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
        const pass = group.get('password')?.value;
        const confirm = group.get('password_confirmation')?.value;
        return pass === confirm ? null : { passwordMismatch: true };
    }

    // Getters for cleaner template usage
    get name() {
        return this.registerForm.get('name')!;
    }
    get email() {
        return this.registerForm.get('email')!;
    }
    get password() {
        return this.registerForm.get('password')!;
    }
    get password_confirmation() {
        return this.registerForm.get('password_confirmation')!;
    }

    submitForm() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.auth.register(this.registerForm.value).subscribe({
            next: (res) => {
                localStorage.setItem('dbToken', res.token);
                this.router.navigate(['/pages/brands']);
            },
            error: (err) => console.error(err)
        });
    }
}

//  <form (ngSubmit)="submitForm()" [formGroup]="registerForm" novalidate>

//             <!-- Name -->
//             <div class="mb-5">
//               <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Name</label>
//               <input
//                 pInputText
//                 id="name"
//                 type="text"
//                 placeholder="Full name"
//                 class="w-full md:w-[30rem]"
//                 formControlName="name"
//               />
//               @if (name.invalid && name.touched) {
//                 <small class="text-red-500 block mt-1">
//                   @if (name.errors?.['required']) { Name is required. }
//                   @if (name.errors?.['minlength']) { Minimum 3 characters. }
//                   @if (name.errors?.['maxlength']) { Maximum 20 characters. }
//                 </small>
//               }
//             </div>

//             <!-- Email -->
//             <div class="mb-5">
//               <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
//               <input
//                 pInputText
//                 id="email"
//                 type="email"
//                 placeholder="Email address"
//                 class="w-full md:w-[30rem]"
//                 formControlName="email"
//               />
//               @if (email.invalid && email.touched) {
//                 <small class="text-red-500 block mt-1">
//                   @if (email.errors?.['required']) { Email is required. }
//                   @if (email.errors?.['email']) { Enter a valid email. }
//                 </small>
//               }
//             </div>

//             <!-- Password -->
//             <div class="mb-5">
//               <label for="password" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Password</label>
//                                        <p-password id="password" formControlName="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

//               @if (password.invalid && password.touched) {
//                 <small class="text-red-500 block mt-1">
//                   @if (password.errors?.['required']) { Password is required. }
//                   @if (password.errors?.['minlength']) { Minimum 5 characters. }
//                 </small>
//               }
//             </div>

//             <!-- Confirm Password -->
//             <div class="mb-8">
//               <label for="password_confirmation" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Confirm Password</label>

//        <p-password    id="password_confirmation"
//                 formControlName="password_confirmation"
//                 placeholder="Confirm password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

//               @if (password_confirmation.invalid && password_confirmation.touched) {
//                 <small class="text-red-500 block mt-1">
//                   @if (password_confirmation.errors?.['required']) { Confirmation is required. }
//                   @if (password_confirmation.errors?.['minlength']) { Minimum 5 characters. }
//                 </small>
//               }

//               @if (registerForm.errors?.['passwordMismatch'] && password_confirmation.touched) {
//                 <small class="text-red-500 block mt-1">Passwords do not match.</small>
//               }
//             </div>

//             <!-- Submit Button -->
//             <p-button
//               label="Register"
//               styleClass="w-full"
//               type="submit"
//               [disabled]="registerForm.invalid"
//             ></p-button>

//           </form>
