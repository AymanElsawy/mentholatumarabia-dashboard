import { Validators } from '@angular/forms';

export const BLOG_FORM_LABELS: { [key: string]: string } = {
    title_en: 'English title',
    title_ar: 'Arabic title',
    excerpt_en: 'English excerpt',
    excerpt_ar: 'Arabic excerpt',
    slug_en: 'English slug',
    slug_ar: 'Arabic slug',
    content_en: 'English content',
    content_ar: 'Arabic content',
    thumbnail: 'Thumbnail image',
    image: 'Main image',
    meta_title_en: 'Meta title (EN)',
    meta_title_ar: 'Meta title (AR)',
    meta_description_en: 'Meta description (EN)',
    meta_description_ar: 'Meta description (AR)',
    meta_keywords_en: 'Meta keywords (EN)',
    meta_keywords_ar: 'Meta keywords (AR)'
};

export const getBlogFormConfig = () => ({
    title_en: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    title_ar: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    content_en: ['', [Validators.required, Validators.minLength(20)]],
    content_ar: ['', [Validators.required, Validators.minLength(20)]],
    excerpt_en: ['', [Validators.required, Validators.maxLength(200)]],
    excerpt_ar: ['', [Validators.required, Validators.maxLength(200)]],
    slug_en: ['', [Validators.required, Validators.maxLength(100)]],
    slug_ar: ['', [Validators.required, Validators.maxLength(100)]],
    thumbnail: ['', Validators.required],
    image: ['', Validators.required],
    meta_title_en: ['', [Validators.required, Validators.maxLength(60)]],
    meta_title_ar: ['', [Validators.required, Validators.maxLength(60)]],
    meta_description_en: ['', [Validators.required, Validators.maxLength(160)]],
    meta_description_ar: ['', [Validators.required, Validators.maxLength(160)]],
    meta_keywords_en: ['', [Validators.required]],
    meta_keywords_ar: ['', [Validators.required]]
});
