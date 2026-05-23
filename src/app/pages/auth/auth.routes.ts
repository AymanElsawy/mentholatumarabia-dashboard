import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { Register } from './register';
import { ResetPasswordComponent } from './resetPasswword';

export default [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'reset-password', component: ResetPasswordComponent }


] as Routes;
