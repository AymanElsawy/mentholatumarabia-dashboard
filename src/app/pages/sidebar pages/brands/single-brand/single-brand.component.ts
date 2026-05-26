import { Component, signal, inject, computed, effect, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandsService } from '../../../../core/services/brands.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { PageHeaderComponent } from '../../../../core/components/page-header/page-header.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { BRAND_FORM_MESSAGES, getBrandFormConfig } from '../constants/single-brand.constants';
import { FileUploadComponent } from '../../../../core/components/file-upload/file-upload.component';

@Component({
    selector: 'app-single-brand',
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, CommonModule, FieldsetModule, TextareaModule, ProgressSpinnerModule, PageHeaderComponent, FileUploadComponent],
    templateUrl: './single-brand.component.html',
    styleUrl: './single-brand.component.scss'
})
export class SingleBrandComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private brands = inject(BrandsService);
    private cd = inject(ChangeDetectorRef);
    private messageService = inject(MessageService);

    id = toSignal(this.activatedRoute.paramMap.pipe(map(p => p.get('id'))));
    isEditMode = computed(() => !!this.id() && this.id() !== 'add');

    brandForm: FormGroup = this.fb.group(getBrandFormConfig());

    submitting = signal(false);

    brandResource = rxResource({
        params: () => this.id(),
        stream: ({ params: id }) => {
            if (id && id !== 'add') {
                return this.brands.getSingleBrands(id);
            }
            return of(null);
        }
    });

    loading = computed(() => this.brandResource.isLoading());

    constructor() {
        effect(() => {
            const isEdit = this.isEditMode();
            if (isEdit) {
                this.brandForm.get('banner_image')?.clearValidators();
                this.brandForm.get('image')?.clearValidators();
            } else {
                this.brandForm.get('banner_image')?.setValidators([Validators.required]);
                this.brandForm.get('image')?.setValidators([Validators.required]);
            }
            this.brandForm.get('banner_image')?.updateValueAndValidity();
            this.brandForm.get('image')?.updateValueAndValidity();
        });

        effect(() => {
            const res = this.brandResource.value() as any;
            if (res && res.brand) {
                this.brandForm.patchValue(res.brand);
            }
        });
    }

    async submitForm() {
        if (this.brandForm.invalid) {
            this.brandForm.markAllAsTouched();
            return;
        }
        this.submitting.set(true);

        const formData = new FormData();

        Object.keys(this.brandForm.value).forEach((key) => {
            const val = this.brandForm.value[key];
            if (val && key !== 'banner_image' && key !== 'image') {
                formData.append(key, val);
            }
        });

        const bannerImage = this.brandForm.get('banner_image')?.value;
        if (bannerImage instanceof File) {
            formData.append('banner_image', bannerImage);
        }

        const image = this.brandForm.get('image')?.value;
        if (image instanceof File) {
            formData.append('image', image);
        }

        const currentId = this.id();
        const request = currentId !== 'add' && currentId ? this.brands.UpdateBrand(currentId, formData) : this.brands.AddBrand(formData);

        request.subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Brand saved successfully',
                    life: 3000
                });
                this.router.navigate(['/pages/brands']);
                this.submitting.set(false);
            },
            error: (err) => {
                console.error('API Error:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err?.error?.message || 'Something went wrong',
                    life: 4000
                });
                this.submitting.set(false);
            }
        });
    }



    isFieldInvalid(fieldName: string): boolean {
        const field = this.brandForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

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

    private getRequiredMessage(fieldName: string): string {
        return BRAND_FORM_MESSAGES[fieldName] || 'This field is required';
    }

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

    get isFormValid(): boolean {
        return this.brandForm.valid;
    }
}
