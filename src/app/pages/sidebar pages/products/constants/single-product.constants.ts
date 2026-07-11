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
    brand_id: 'Brand selection is required',
    category_id: 'Category selection is required'
};

export interface IconOption {
    label: string;
    value: string;
}

export const FEATURE_ICON_OPTIONS: IconOption[] = [
    { label: 'bolt', value: 'pi pi-bolt' },
    { label: 'circle', value: 'pi pi-check-circle' },
    { label: 'clock', value: 'pi pi-clock' },
    { label: 'bullseye', value: 'pi pi-bullseye' },
    { label: 'ban', value: 'pi pi-ban' },
    { label: 'wave-pulse', value: 'pi pi-wave-pulse' }
];

export const BENEFIT_ICON_OPTIONS: IconOption[] = [
    { label: 'clock', value: 'pi pi-clock' },
    { label: 'bolt', value: 'pi pi-bolt' },
    { label: 'circle', value: 'pi pi-check-circle' },
    { label: 'Protection', value: 'pi pi-shield' }
];

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
    returns_and_exchanges_en: [''],
    returns_and_exchanges_ar: [''],
    thumbnail: ['', Validators.required],
    main_image: [''],
    images: [[], [Validators.required, minArrayLengthValidator(1)]],
    countries: fb.array([], [Validators.required, minArrayLengthValidator(1)]),
    meta_title_en: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]],
    meta_title_ar: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]],
    meta_description_en: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(160)]],
    meta_description_ar: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(160)]],
    meta_keywords_en: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    meta_keywords_ar: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    brand_id: ['', Validators.required],
    category_id: [null, Validators.required],
    features: fb.array([]),
    videos: fb.array([]),
    benefits: fb.group({
        background_image: [''],
        items: fb.array([])
    }),
    suitable_areas: fb.array([]),
    how_it_works: fb.array([])
});

export const createFeatureGroup = (fb: FormBuilder) =>
    fb.group({
        icon: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        title_en: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        title_ar: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });

export const createVideoGroup = (fb: FormBuilder) =>
    fb.group({
        thumbnail: ['', Validators.required],
        video_url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });

export const createBenefitItemGroup = (fb: FormBuilder) =>
    fb.group({
        icon: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        title_en: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        title_ar: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        description_en: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
        description_ar: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]]
    });

export const createSuitableAreaGroup = (fb: FormBuilder) =>
    fb.group({
        title_en: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        title_ar: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        image: ['', Validators.required]
    });

export const createHowItWorksGroup = (fb: FormBuilder) =>
    fb.group({
        step: [null, [Validators.required, Validators.min(1)]],
        title_en: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        title_ar: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        description_en: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
        description_ar: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
        image: ['', Validators.required]
    });
