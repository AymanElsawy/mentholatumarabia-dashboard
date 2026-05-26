import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Login } from './app/pages/auth/login';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    template: `<router-outlet></router-outlet><p-toast></p-toast>`
})
export class AppComponent {
    title = 'Mentholatum-dashboard';
}
