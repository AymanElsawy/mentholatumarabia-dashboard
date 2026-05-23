import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Login } from './app/pages/auth/login';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
    title = 'Mentholatum-dashboard';
}
