import { Component, signal, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CountriesService } from '../../../../core/services/countries.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { PageHeaderComponent } from '../../../../core/components/page-header/page-header.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { COUNTRY_FORM_LABELS, getCountryFormConfig } from '../constants/single-country.constants';

@Component({
    selector: 'app-single-country',
    imports: [ProgressSpinnerModule, ReactiveFormsModule, ButtonModule, InputTextModule, PageHeaderComponent],
    templateUrl: './single-country.component.html',
    styleUrl: './single-country.component.scss'
})
export class SingleCountryComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private countryService = inject(CountriesService);
    private messageService = inject(MessageService);

    id = toSignal(this.activatedRoute.paramMap.pipe(map(p => p.get('id'))));
    isEditMode = computed(() => !!this.id() && this.id() !== 'add');

    CountryForm: FormGroup = this.fb.group(getCountryFormConfig());

    submitting = signal(false);

    countryResource = rxResource({
        params: () => this.id(),
        stream: ({ params: id }) => {
            if (id && id !== 'add') {
                return this.countryService.getSingleCountry(id);
            }
            return of(null);
        }
    });

    loading = computed(() => this.countryResource.isLoading());

    constructor() {
        effect(() => {
            const res = this.countryResource.value() as any;
            if (res && res.country) {
                this.CountryForm.patchValue(res.country);
            }
        });
    }

    submitForm() {
        if (this.CountryForm.invalid) {
            this.CountryForm.markAllAsTouched();
            return;
        }

        this.submitting.set(true);
        const currentId = this.id();

        if (this.isEditMode() && currentId) {
            this.countryService.UpdateCountry(currentId, this.CountryForm.value).subscribe({
                next: (res) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Country updated successfully', life: 3000 });
                    this.submitting.set(false);
                    this.router.navigate(['/pages/countries']);
                },
                error: (err) => {
                    console.error(err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Something went wrong', life: 4000 });
                    this.submitting.set(false);
                }
            });
        } else {
            this.countryService.AddCountry(this.CountryForm.value).subscribe({
                next: (res) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Country added successfully', life: 3000 });
                    this.submitting.set(false);
                    this.router.navigate(['/pages/countries']);
                },
                error: (err) => {
                    console.error(err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Something went wrong', life: 4000 });
                    this.submitting.set(false);
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.CountryForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

    getFieldErrorMessage(fieldName: string): string {
        const field = this.CountryForm.get(fieldName);

        if (field && field.errors && (field.dirty || field.touched)) {
            if (field.errors['required']) {
                return `${this.toLabel(fieldName)} is required.`;
            }
            if (field.errors['minlength']) {
                const requiredLength = field.errors['minlength'].requiredLength;
                return `${this.toLabel(fieldName)} must be at least ${requiredLength} characters.`;
            }
            if (field.errors['maxlength']) {
                const requiredLength = field.errors['maxlength'].requiredLength;
                return `${this.toLabel(fieldName)} cannot exceed ${requiredLength} characters.`;
            }
        }

        return '';
    }

    toLabel(fieldName: string): string {
        return COUNTRY_FORM_LABELS[fieldName] || fieldName;
    }
}
