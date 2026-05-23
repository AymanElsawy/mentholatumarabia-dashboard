import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/core/guards/auth.guard';
import { loggedGuard } from './app/core/guards/logged.guard';

export const appRoutes: Routes = [
    {path:"",redirectTo:"auth",pathMatch:"full"},
    {
        path: '',
        component: AppLayout, canActivate:[authGuard],
        children: [
            { path: 'home', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', canActivate:[authGuard], component: Landing },
    { path: 'notfound', canActivate:[authGuard], component: Notfound },
    { path: 'auth', canActivate:[loggedGuard],loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
