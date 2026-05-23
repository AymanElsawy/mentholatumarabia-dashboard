import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="/assets/logo.png" class="h-12 block mx-auto" alt="" />

                            <!-- <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to Mentholatum!</div> -->
                            <span class="text-muted-color font-medium mt-5 block">Sign in to continue</span>
                        </div>

                        <form (ngSubmit)="submitForm()" [formGroup]="loginForm">
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" formControlName="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" formControlName="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                            <div class="flex justify-end">
                                <a [routerLink]="['/auth/reset-password']" class="hover:underline underline-offset-2 text-blue-700 font-bold  mt-3 hover:text-blue-900 ms-auto block my-4"> Forget your password ?</a>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" [disabled]="!loginForm.valid" type="submit"></p-button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    loginForm: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(5)])
    });

    submitForm() {
        this.auth.login(this.loginForm.value).subscribe({
            next: (res) => {
                (localStorage.setItem('dbToken', res.token), this.router.navigate(['/pages/brands']));
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
}
