import { Validators } from '@angular/forms';

export const COUNTRY_FORM_LABELS: { [key: string]: string } = {
    name_en: 'English name',
    name_ar: 'Arabic name'
};

export const getCountryFormConfig = () => ({
    name_en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    name_ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
});
