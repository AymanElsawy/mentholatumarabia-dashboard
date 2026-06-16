import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

export const PRODUCT_FORM_MESSAGES: { [key: string]: string } = {
    name_en: 'English name is required',
    name_ar: 'Arabic name is required',
    slug_en: 'English slug is required',
    slug_ar: 'Arabic slug is required',
    description_en: 'English description is required',
    description_ar: 'Arabic description is required',
    details_en: 'English details are required',
    details_ar: 'Arabic details are required',
    thumbnail: 'Thumbnail image is required',
    images: 'At least one product image is required',
    countries: 'At least one country must be selected',
    meta_title_en: 'English meta title is required',
    meta_title_ar: 'Arabic meta title is required',
    meta_description_en: 'English meta description is required',
    meta_description_ar: 'Arabic meta description is required',
    meta_keywords_en: 'English meta keywords are required',
    meta_keywords_ar: 'Arabic meta keywords are required',
    brand_id: 'Brand selection is required'
};

export const minArrayLengthValidator = (min: number) => {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value && control.value.length >= min) {
            return null;
        }
        return { minArrayLength: { requiredLength: min, actualLength: control.value ? control.value.length : 0 } };
    };
};

export const getProductFormConfig = (fb: FormBuilder) => ({
    name_en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    name_ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    slug_en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    slug_ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    description_en: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    description_ar: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    details_en: ['', [Validators.required, Validators.minLength(20)]],
    details_ar: ['', [Validators.required, Validators.minLength(20)]],
    thumbnail: ['', Validators.required],
    images: [[], [Validators.required, minArrayLengthValidator(1)]],
    countries: fb.array([], [Validators.required, minArrayLengthValidator(1)]),
    meta_title_en: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]],
    meta_title_ar: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]],
    meta_description_en: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(160)]],
    meta_description_ar: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(160)]],
    meta_keywords_en: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    meta_keywords_ar: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    brand_id: ['', Validators.required]
});
