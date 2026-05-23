import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandsService } from '../../../core/services/brands.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';
import { TextareaModule } from 'primeng/textarea';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-single-brand',
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, CommonModule, FileUploadModule, FieldsetModule, TextareaModule],
    templateUrl: './single-brand.component.html',
    styleUrl: './single-brand.component.scss'
})
export class SingleBrandComponent implements OnInit {
    id!: string;
    brandForm!: FormGroup;
    bannerImageFile: File | null = null;
    imageFile: File | null = null;
    bannerImagePreview: string | null = null;
    imagePreview: string | null = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private brands: BrandsService,
        private cd: ChangeDetectorRef // Inject ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.brandForm = this.fb.group({
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
            image: ['', Validators.required]
        });

        this.activatedRoute.paramMap.subscribe((p) => {
            this.id = p.get('id') as string;
            if (this.id !== 'add') {
                this.getData();
            }
        });
    }

    getData() {
        this.brands.getSingleBrands(this.id).subscribe({
            next: (res) => {
                this.brandForm.patchValue(res.brand);

                // Store URLs only for preview
                this.bannerImagePreview = res.brand.banner_image || null;
                this.imagePreview = res.brand.image || null;

                // Keep file variables null initially (only update when new files are uploaded)
                this.bannerImageFile = null;
                this.imageFile = null;
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    async submitForm() {
        if (this.brandForm.invalid) {
            this.brandForm.markAllAsTouched();
            return;
        }

        const formData = new FormData();

        Object.keys(this.brandForm.value).forEach((key) => {
            if (this.brandForm.value[key] && key !== 'banner_image' && key !== 'image') {
                formData.append(key, this.brandForm.value[key]);
            }
        });

        if (this.bannerImageFile instanceof File) {
            formData.append('banner_image', this.bannerImageFile);
        }

        if (this.imageFile instanceof File) {
            formData.append('image', this.imageFile);
        }

       

        const request = this.id !== 'add' ? this.brands.UpdateBrand(this.id, formData) : this.brands.AddBrand(formData);

        request.subscribe({
            next: (res) => {
                console.log('Success:', res);
                this.router.navigate(['/pages/brands']);
            },
            error: (err) => {
                console.error('API Error:', err);
            }
        });
    }

    async urlToFile(imageUrl: string, fileName: string): Promise<File> {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
    }

    // submitForm() {
    //   if (this.brandForm.invalid) return;

    //   const formData = new FormData();
    //   Object.keys(this.brandForm.value).forEach((key) => {
    //     if (this.brandForm.value[key]) {
    //       formData.append(key, this.brandForm.value[key]);
    //     }
    //   });

    //   if (this.bannerImageFile) formData.append('banner_image', this.bannerImageFile);
    //   if (this.imageFile) formData.append('image', this.imageFile);

    //   const request = this.id !== 'add'
    //     ? this.brands.UpdateBrand(this.id, formData)
    //     : this.brands.AddBrand(formData);

    //   request.subscribe({
    //     next: (res) => {
    //       console.log('Success:', res);
    //       this.router.navigate(['/pages/brands']);
    //     },
    //     error: (err) => {
    //       console.error('API Error:', err);
    //     }
    //   });
    // }

    // Handle File Uploads
    onFileSelect(event: any, controlName: string) {
        const file = event.files[0]; // Get the selected file
        if (file) {
            const objectUrl = URL.createObjectURL(file);

            if (controlName === 'banner_image') {
                this.bannerImageFile = file;
                this.bannerImagePreview = objectUrl;
            } else if (controlName === 'image') {
                this.imageFile = file;
                this.imagePreview = objectUrl;
            }

            this.cd.detectChanges(); // ✅ Force change detection
            this.brandForm.patchValue({ [controlName]: file });
            this.brandForm.get(controlName)?.updateValueAndValidity();
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.brandForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

    // Helper method to get field error message
    getFieldErrorMessage(fieldName: string): string {
        const field = this.brandForm.get(fieldName);

        if (field && field.errors && (field.dirty || field.touched)) {
            if (field.errors['required']) {
                return this.getRequiredMessage(fieldName);
            }
            if (field.errors['minlength']) {
                const requiredLength = field.errors['minlength'].requiredLength;
                const actualLength = field.errors['minlength'].actualLength;
                return `Minimum length is ${requiredLength} characters (current: ${actualLength})`;
            }
            if (field.errors['maxlength']) {
                const requiredLength = field.errors['maxlength'].requiredLength;
                const actualLength = field.errors['maxlength'].actualLength;
                return `Maximum length is ${requiredLength} characters (current: ${actualLength})`;
            }
        }

        return '';
    }

    // Get specific required message based on field
    private getRequiredMessage(fieldName: string): string {
        const messages: { [key: string]: string } = {
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
            image: 'Image is required'
        };

        return messages[fieldName] || 'This field is required';
    }

    // Get CSS classes for form controls
    getInputClasses(fieldName: string): string {
        const field = this.brandForm.get(fieldName);
        const baseClasses = 'w-full';

        if (field && (field.dirty || field.touched)) {
            if (field.valid) {
                return `${baseClasses} ng-valid`;
            } else {
                return `${baseClasses} ng-invalid`;
            }
        }

        return baseClasses;
    }

    // File selection handler

    get isFormValid(): boolean {
        return this.brandForm.valid;
    }
}
