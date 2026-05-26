import { Validators } from '@angular/forms';

export const getAdminFormConfig = () => ({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['']
});
