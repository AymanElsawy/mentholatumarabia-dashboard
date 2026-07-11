import { Component, signal, inject, computed, effect, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../../core/services/categories.service';
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
import { CATEGORY_FORM_MESSAGES, getCategoryFormConfig } from '../constants/single-category.constants';
import { FileUploadComponent } from '../../../../core/components/file-upload/file-upload.component';

@Component({
    selector: 'app-single-category',
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, CommonModule, FieldsetModule, TextareaModule, ProgressSpinnerModule, PageHeaderComponent, FileUploadComponent],
    templateUrl: './single-category.component.html',
    styleUrl: './single-category.component.scss'
})
export class SingleCategoryComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private categories = inject(CategoriesService);
    private cd = inject(ChangeDetectorRef);
    private messageService = inject(MessageService);

    id = toSignal(this.activatedRoute.paramMap.pipe(map(p => p.get('id'))));
    isEditMode = computed(() => !!this.id() && this.id() !== 'add');

    categoryForm: FormGroup = this.fb.group(getCategoryFormConfig());

    submitting = signal(false);

    categoryResource = rxResource({
        params: () => this.id(),
        stream: ({ params: id }) => {
            if (id && id !== 'add') {
                return this.categories.getSingleCategory(id);
            }
            return of(null);
        }
    });

    loading = computed(() => this.categoryResource.isLoading());

    constructor() {
        effect(() => {
            const isEdit = this.isEditMode();
            if (isEdit) {
                this.categoryForm.get('banner_image')?.clearValidators();
                this.categoryForm.get('image')?.clearValidators();
            } else {
                this.categoryForm.get('banner_image')?.setValidators([Validators.required]);
                this.categoryForm.get('image')?.setValidators([Validators.required]);
            }
            this.categoryForm.get('banner_image')?.updateValueAndValidity();
            this.categoryForm.get('image')?.updateValueAndValidity();
        });

        effect(() => {
            const res = this.categoryResource.value() as any;
            if (res && res.category) {
                this.categoryForm.patchValue(res.category);
            }
        });
    }

    async submitForm() {
        if (this.categoryForm.invalid) {
            this.categoryForm.markAllAsTouched();
            return;
        }
        this.submitting.set(true);

        const formData = new FormData();

        Object.keys(this.categoryForm.value).forEach((key) => {
            const val = this.categoryForm.value[key];
            if (val && key !== 'banner_image' && key !== 'image') {
                formData.append(key, val);
            }
        });

        const bannerImage = this.categoryForm.get('banner_image')?.value;
        if (bannerImage instanceof File) {
            formData.append('banner_image', bannerImage);
        }

        const image = this.categoryForm.get('image')?.value;
        if (image instanceof File) {
            formData.append('image', image);
        }

        const currentId = this.id();
        const request = currentId !== 'add' && currentId ? this.categories.UpdateCategory(currentId, formData) : this.categories.AddCategory(formData);

        request.subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Category saved successfully',
                    life: 3000
                });
                this.router.navigate(['/pages/categories']);
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
        const field = this.categoryForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

    getFieldErrorMessage(fieldName: string): string {
        const field = this.categoryForm.get(fieldName);

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
        return CATEGORY_FORM_MESSAGES[fieldName] || 'This field is required';
    }

    getInputClasses(fieldName: string): string {
        const field = this.categoryForm.get(fieldName);
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
        return this.categoryForm.valid;
    }
}
