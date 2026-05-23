import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CountriesService } from '../../../core/services/countries.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-single-country',
    imports: [NgIf, ReactiveFormsModule, ButtonModule, InputTextModule],
    templateUrl: './single-country.component.html',
    styleUrl: './single-country.component.scss'
})
export class SingleCountryComponent {
    id!: string;
    CountryForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private country: CountriesService
    ) {}
    ngOnInit(): void {
        this.CountryForm = this.fb.group({
            name_en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            name_ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
        });

        this.activatedRoute.paramMap.subscribe((p) => {
            this.id = p.get('id') as string;
            if (this.id != 'add') {
                this.getData();
            } else {
                this.CountryForm = this.fb.group({
                    name_en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                    name_ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
                });
            }
        });
    }

    getData() {
        this.country.getSingleCountry(this.id).subscribe({
            next: (res) => {
                this.CountryForm.patchValue(res.country);
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    submitForm() {
        if (this.CountryForm.invalid) {
            this.CountryForm.markAllAsTouched();
            return;
        }
        if (this.id != 'add') {
            this.country.UpdateCountry(this.id, this.CountryForm.value).subscribe({
                next: (res) => {

                    this.router.navigate(['/pages/countries']);
                },
                error: (err) => {
                    console.log(err);
                }
            });
        } else {
            this.country.AddCountry(this.CountryForm.value).subscribe({
                next: (res) => {
                 
                    this.router.navigate(['/pages/countries']);
                },
                error: (err) => {
                    console.log(err);
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

        if (field && field.errors) {
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
        const labels: { [key: string]: string } = {
            name_en: 'English name',
            name_ar: 'Arabic name'
        };
        return labels[fieldName] || fieldName;
    }
}
