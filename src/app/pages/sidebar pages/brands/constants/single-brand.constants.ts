import { Validators } from '@angular/forms';

export const BRAND_FORM_MESSAGES: { [key: string]: string } = {
    name_en: 'English name is required',
    name_ar: 'Arabic name is required',
    banner_image: 'Banner image is required',
    banner_title_en: 'Banner title (English) is required',
    banner_title_ar: 'Banner title (Arabic) is required',
    banner_desc_en: 'Banner description (English) is required',
    banner_desc_ar: 'Banner description (Arabic) is required',
    title_en: 'Title (English) is required',
    title_ar: 'Title (Arabic) is required',
    desc_en: 'Description (English) is required',
    desc_ar: 'Description (Arabic) is required',
    image: 'Image is required',
    meta_title_en: 'Meta title (English) is required',
    meta_title_ar: 'Meta title (Arabic) is required',
    meta_desc_en: 'Meta description (English) is required',
    meta_desc_ar: 'Meta description (Arabic) is required'
};

export const getBrandFormConfig = () => ({
    name_en: ['', [Validators.required, Validators.minLength(3)]],
    name_ar: ['', [Validators.required, Validators.minLength(3)]],
    banner_image: ['', Validators.required],
    banner_title_en: ['', [Validators.required, Validators.minLength(3)]],
    banner_title_ar: ['', [Validators.required, Validators.minLength(3)]],
    banner_desc_en: ['', [Validators.required, Validators.minLength(10)]],
    banner_desc_ar: ['', [Validators.required, Validators.minLength(10)]],
    title_en: ['', [Validators.required, Validators.minLength(3)]],
    title_ar: ['', [Validators.required, Validators.minLength(3)]],
    desc_en: ['', [Validators.required, Validators.minLength(10)]],
    desc_ar: ['', [Validators.required, Validators.minLength(10)]],
    image: ['', Validators.required],
    meta_title_en: ['', [Validators.required, Validators.minLength(3)]],
    meta_title_ar: ['', [Validators.required, Validators.minLength(3)]],
    meta_desc_en: ['', [Validators.required, Validators.minLength(10)]],
    meta_desc_ar: ['', [Validators.required, Validators.minLength(10)]]
});
