import { ChangeDetectorRef, Component, signal, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsService } from '../../../../core/services/products.service';
import { EditorModule } from 'primeng/editor';
import { FluidModule } from 'primeng/fluid';
import { CountriesService } from '../../../../core/services/countries.service';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { BrandsService } from '../../../../core/services/brands.service';
import { FileUploadComponent } from '../../../../core/components/file-upload/file-upload.component';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { PageHeaderComponent } from '../../../../core/components/page-header/page-header.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { getProductFormConfig, minArrayLengthValidator, PRODUCT_FORM_MESSAGES } from '../constants/single-product.constants';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'app-single-product',
    imports: [ FileUploadComponent, AccordionModule, CheckboxModule, FieldsetModule, ProgressSpinnerModule, SelectModule, FluidModule, ReactiveFormsModule, ButtonModule, InputTextModule, PageHeaderComponent,EditorModule ],
    templateUrl: './single-product.component.html',
    styleUrl: './single-product.component.scss'
})
export class SingleProductComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private ProductsService = inject(ProductsService);
    private countriesService = inject(CountriesService);
    private brandService = inject(BrandsService);
    private changeDetectorRef = inject(ChangeDetectorRef);
    private messageService = inject(MessageService);

    id = toSignal(this.activatedRoute.paramMap.pipe(map(p => p.get('id'))));
    isEditMode = computed(() => !!this.id() && this.id() !== 'add');

    countriesList: any[] = [];
    brands: any[] = [];
    productData: any;

    submitting = signal(false);

    productForm: FormGroup = this.fb.group(getProductFormConfig(this.fb));

    countriesResource = rxResource({
        stream: () => this.countriesService.getCountries()
    });

    brandsResource = rxResource({
        stream: () => this.brandService.getBrands()
    });

    productResource = rxResource({
        params: () => this.id(),
        stream: ({ params: id }) => {
            if (id && id !== 'add') {
                return this.ProductsService.getSingleProduct(id);
            }
            return of(null);
        }
    });

    loading = computed(() => {
        return this.countriesResource.isLoading() || 
               this.brandsResource.isLoading() || 
               this.productResource.isLoading();
    });

    private formInitialized = false;

    constructor() {
        // Toggle validators based on edit mode
        effect(() => {
            const isEdit = this.isEditMode();
            
            if (isEdit) {
                this.productForm.get('thumbnail')?.clearValidators();
                this.productForm.get('images')?.clearValidators();
            } else {
                this.productForm.get('thumbnail')?.setValidators([Validators.required]);
                this.productForm.get('images')?.setValidators([Validators.required, minArrayLengthValidator(1)]);
            }
            
            this.productForm.get('thumbnail')?.updateValueAndValidity();
            this.productForm.get('images')?.updateValueAndValidity();
        });

        // Effect to initialize the form data once resources are loaded
        effect(() => {
            const isEdit = this.isEditMode();
            const countriesData = this.countriesResource.value() as any;
            const brandsData = this.brandsResource.value() as any;
            const productData = this.productResource.value() as any;

            if (brandsData?.brands) {
                this.brands = brandsData.brands;
            }

            if (!countriesData || !countriesData.countries) return;

            this.countriesList = countriesData.countries;

            if (isEdit) {
                // In edit mode, wait for product data as well
                if (productData && productData.product && !this.formInitialized) {
                    this.patchFormWithProductData(productData.product, countriesData.countries);
                    this.formInitialized = true;
                }
            } else {
                // In add mode, we only need countries
                if (!this.formInitialized) {
                    this.initEmptyForm(countriesData.countries);
                    this.formInitialized = true;
                }
            }
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.productForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

    getFieldErrorMessage(fieldName: string): string {
        const field = this.productForm.get(fieldName);

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
            if (field.errors['minArrayLength']) {
                const requiredLength = field.errors['minArrayLength'].requiredLength;
                const actualLength = field.errors['minArrayLength'].actualLength;
                return `At least ${requiredLength} item(s) required (current: ${actualLength})`;
            }
        }

        return '';
    }

    private getRequiredMessage(fieldName: string): string {
        return PRODUCT_FORM_MESSAGES[fieldName] || 'This field is required';
    }

    getInputClasses(fieldName: string): string {
        const field = this.productForm.get(fieldName);
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

    initEmptyForm(countriesList: any[]) {
        const countriesArray = this.productForm.get('countries') as FormArray;
        countriesArray.clear();
        countriesList.forEach((country) => {
            countriesArray.push(this.fb.group({
                country_id: [country.id],
                where_to_buy_link: this.fb.array([this.fb.control('')]),
                available_in_pharmacies: [0]
            }));
        });
    }

    get countriesControls() {
        let x = (this.productForm.get('countries') as FormArray)?.controls;
        return x || [];
    }

    patchFormWithProductData(product: any, countriesList: any[]) {
        this.productData = product;

        this.productForm.patchValue({
            name_en: product.name_en || '',
            name_ar: product.name_ar || '',
            slug_en: product.slug_en || '',
            slug_ar: product.slug_ar || '',
            brand_id: product.brand_id || null,
            description_en: product.description_en || '',
            description_ar: product.description_ar || '',
            details_en: product.details_en || '',
            details_ar: product.details_ar || '',
            meta_description_en: product.meta_description_en || '',
            meta_description_ar: product.meta_description_ar || '',
            meta_keywords_en: product.meta_keywords_en || '',
            meta_keywords_ar: product.meta_keywords_ar || '',
            meta_title_en: product.meta_title_en || '',
            meta_title_ar: product.meta_title_ar || '',
            images: product.images || [],
            thumbnail: product.thumbnail || null
        });

        // Handle countries form array
        const countriesArray = this.productForm.get('countries') as FormArray;
        countriesArray.clear();

        // Create a map of existing product countries for quick lookup
        const productCountriesMap = new Map();
        if (product.countries && product.countries.length > 0) {
            product.countries.forEach((country: any) => {
                let links = [''];
                if (country.pivot?.where_to_buy_link) {
                    if (Array.isArray(country.pivot.where_to_buy_link)) {
                        links = country.pivot.where_to_buy_link.length > 0 ? country.pivot.where_to_buy_link : [''];
                    } else {
                        try {
                            const parsed = JSON.parse(country.pivot.where_to_buy_link);
                            if (Array.isArray(parsed)) {
                                // If array is empty, use single empty string; otherwise use the parsed array
                                links = parsed.length > 0 ? parsed : [''];
                            } else if (typeof parsed === 'string') {
                                links = [parsed];
                            } else {
                                links = [''];
                            }
                        } catch (e) {
                            links = [country.pivot.where_to_buy_link];
                        }
                    }
                }

                productCountriesMap.set(country.id, {
                    where_to_buy_link: links,
                    available_in_pharmacies: Number(country.pivot?.available_in_pharmacies || 0)
                });
            });
        }

        // Loop through ALL countries from the countriesList and add them
        countriesList.forEach((country) => {
            const existingData = productCountriesMap.get(country.id);
            const linksArray = existingData?.where_to_buy_link || [''];

            countriesArray.push(
                this.fb.group({
                    country_id: [country.id],
                    where_to_buy_link: this.fb.array(linksArray.map((link: string) => this.fb.control(link))),
                    available_in_pharmacies: [existingData?.available_in_pharmacies || 0]
                })
            );
        });

        this.changeDetectorRef.detectChanges();
    }



    submitForm() {
        if (this.id() !== 'add') {
            this.updateProduct();
        } else {
            this.AddProduct();
        }
    }

    AddProduct() {
        this.submitting.set(true);
        const formData = new FormData();

        Object.keys(this.productForm.controls).forEach((key) => {
            const value = this.productForm.get(key)?.value;
            if (key !== 'images' && key !== 'countries' && key !== 'thumbnail' && value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        const countriesArray = this.productForm.get('countries')?.value || [];
        countriesArray.forEach((country: any, index: number) => {
            const countryId = country.country_id;
            const pharmacy = country.available_in_pharmacies;

            formData.append(`countries[${index}][country_id]`, String(countryId));
            formData.append(`countries[${index}][available_in_pharmacies]`, pharmacy);

            if (Array.isArray(country.where_to_buy_link)) {
                country.where_to_buy_link.forEach((link: string) => {
                    if (link && link.trim()) {
                        formData.append(`countries[${index}][where_to_buy_link][]`, link.trim());
                    }
                });
            } else if (country.where_to_buy_link) {
                formData.append(`countries[${index}][where_to_buy_link][]`, String(country.where_to_buy_link).trim());
            }
        });

        const imagesArray = this.productForm.get('images')?.value || [];
        imagesArray.forEach((file: any) => {
            if (file instanceof File) {
                formData.append('images[]', file);
            }
        });

        const thumbnail = this.productForm.get('thumbnail')?.value;
        if (thumbnail instanceof File) {
            formData.append('thumbnail', thumbnail);
        }

        this.ProductsService.AddProduct(formData).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully', life: 3000 });
                this.router.navigate(['/pages/products']);
                this.submitting.set(false);
            },
            error: (err) => {
                console.log(err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Something went wrong', life: 4000 });
                this.submitting.set(false);
            }
        });
    }

    updateProduct() {
        this.submitting.set(true);
        const formData = new FormData();

        Object.keys(this.productForm.controls).forEach((key) => {
            const value = this.productForm.get(key)?.value;

            if (key !== 'images' && key !== 'countries' && key !== 'thumbnail' && value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        const countriesArray = this.productForm.get('countries')?.value || [];
        countriesArray.forEach((country: any, index: number) => {
            const countryId = country.country_id;
            const pharmacy = country.available_in_pharmacies;

            formData.append(`countries[${index}][country_id]`, String(countryId));
            formData.append(`countries[${index}][available_in_pharmacies]`, pharmacy);

            if (Array.isArray(country.where_to_buy_link)) {
                country.where_to_buy_link.forEach((link: string) => {
                    if (link && link.trim()) {
                        formData.append(`countries[${index}][where_to_buy_link][]`, link.trim());
                    }
                });
            } else if (country.where_to_buy_link) {
                formData.append(`countries[${index}][where_to_buy_link][]`, String(country.where_to_buy_link).trim());
            }
        });

        const imagesArray = this.productForm.get('images')?.value || [];
        imagesArray.forEach((file: any) => {
            if (file instanceof File) {
                formData.append('images[]', file);
            }
        });

        const thumbnail = this.productForm.get('thumbnail')?.value;
        if (thumbnail instanceof File) {
            formData.append('thumbnail', thumbnail);
        }

        const currentId = this.id();
        if (!currentId) return;

        this.ProductsService.UpdateProduct(currentId, formData).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully', life: 3000 });
                this.router.navigate(['/pages/products']);
                this.submitting.set(false);
            },
            error: (err) => {
                console.log(err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Something went wrong', life: 4000 });
                this.submitting.set(false);
            }
        });
    }

    getAvailableInPharmaciesControl(i: number): FormControl {
        return this.countriesControls[i].get('available_in_pharmacies') as FormControl;
    }

    getWhereToBuyLinks(countryIndex: number): FormArray {
        return this.countriesControls[countryIndex].get('where_to_buy_link') as FormArray;
    }

    addWhereToBuyLink(countryIndex: number) {
        this.getWhereToBuyLinks(countryIndex).push(this.fb.control(''));
    }

    removeWhereToBuyLink(countryIndex: number, linkIndex: number) {
        this.getWhereToBuyLinks(countryIndex).removeAt(linkIndex);
    }
}
