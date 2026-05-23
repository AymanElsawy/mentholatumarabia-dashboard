import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsService } from '../../../core/services/products.service';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { CountriesService } from '../../../core/services/countries.service';
import { NgFor, NgIf } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { BrandsService } from '../../../core/services/brands.service';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'app-single-product',
    imports: [NgIf, FileUploadModule, CheckboxModule, FieldsetModule, SelectModule, NgFor, FluidModule, TextareaModule, ReactiveFormsModule, ButtonModule, InputTextModule],
    templateUrl: './single-product.component.html',
    styleUrl: './single-product.component.scss'
})
export class SingleProductComponent {
    id!: string;
    productForm!: FormGroup;
    countriesList: any[] = [];
    brands: any[] = [];
    uploadedFiles: any[] = [];
    displayedThumbnail: string | null = null;
    displayedMainImage: string | null = null;
    displayedImages: string[] = [];
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ProductsService: ProductsService,
        private countriesService: CountriesService,
        private brandService: BrandsService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}
    ngOnInit(): void {
        this.getCountries();
        this.getBrands();
        this.productForm = this.fb.group({
            name_en: [''],
            name_ar: [''],
            description_en: [''],
            description_ar: [''],
            details_ar: [''],
            details_en: [''],
            thumbnail: [''],
            images: this.fb.array([]),
            countries: this.fb.array([]),
            meta_title_en: [''],
            meta_title_ar: [''],
            meta_description_en: [''],
            meta_description_ar: [''],
            meta_keywords_en: [''],
            meta_keywords_ar: [''],
            brand_id: ['']
        });

        this.activatedRoute.paramMap.subscribe((p) => {
            this.id = p.get('id') as string;
            if (this.id != 'add') {
                this.getData();
            } else {
                this.productForm = this.fb.group({
                    // Basic Information
                    name_en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
                    name_ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
                    description_en: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
                    description_ar: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
                    details_en: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
                    details_ar: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],

                    // Media
                    thumbnail: ['', Validators.required],
                    images: this.fb.array([], [Validators.required, this.minArrayLength(1)]),

                    // Location
                    countries: this.fb.array([], [Validators.required, this.minArrayLength(1)]),

                    // SEO Meta Data
                    meta_title_en: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]],
                    meta_title_ar: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]],
                    meta_description_en: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(160)]],
                    meta_description_ar: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(160)]],
                    meta_keywords_en: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
                    meta_keywords_ar: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],

                    // Brand
                    brand_id: ['', Validators.required]
                });
            }
        });
    }
    minArrayLength(min: number) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && control.value.length >= min) {
                return null;
            }
            return { minArrayLength: { requiredLength: min, actualLength: control.value ? control.value.length : 0 } };
        };
    }

    // Helper method to check if field is invalid and touched
    isFieldInvalid(fieldName: string): boolean {
        const field = this.productForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

    // Helper method to get field error message
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

    // Get specific required message based on field
    private getRequiredMessage(fieldName: string): string {
        const messages: { [key: string]: string } = {
            name_en: 'English name is required',
            name_ar: 'Arabic name is required',
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

        return messages[fieldName] || 'This field is required';
    }

    // Get CSS classes for form controls
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
    getCountries() {
        this.countriesService.getCountries().subscribe({
            next: (res) => {
                this.countriesList = res.countries;
                this.initCountries();
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    initCountries() {
        const countriesArray = this.productForm.get('countries') as FormArray;
        this.countriesList.forEach((country) => {
            countriesArray.push(this.createCountryFormGroup(country));
        });
    }
    createCountryFormGroup(country: any): FormGroup {
        return this.fb.group({
            country_id: [country.id],
            where_to_buy_link: [''],
            available_in_pharmacies: [0]
        });
    }

    get countriesControls() {
        let x = (this.productForm.get('countries') as FormArray)?.controls;

        return x || [];
    }

    productData: any;
    getData() {
        this.ProductsService.getSingleProduct(this.id).subscribe({
            next: (res) => {
                this.productData = res.product;

                this.displayedImages = res.product.images || [];

                this.productForm.patchValue({
                    name_en: res.product.name_en || '',
                    name_ar: res.product.name_ar || '',
                    brand_id: res.product.brand_id || null,
                    description_en: res.product.description_en || '',
                    description_ar: res.product.description_ar || '',
                    details_en: res.product.details_en || '',
                    details_ar: res.product.details_ar || '',
                    meta_description_en: res.product.meta_description_en || '',
                    meta_description_ar: res.product.meta_description_ar || '',
                    meta_keywords_en: res.product.meta_keywords_en || '',
                    meta_keywords_ar: res.product.meta_keywords_ar || '',
                    meta_title_en: res.product.meta_title_en || '',
                    meta_title_ar: res.product.meta_title_ar || ''
                });

                // Handle images form array
                this.productForm.setControl('images', this.fb.array([]));
                const imagesArray = this.productForm.get('images') as FormArray;

                if (res.product.images && Array.isArray(res.product.images)) {
                    res.product.images.forEach((imageUrl: string) => {
                        imagesArray.push(this.fb.control(imageUrl)); // Store full URLs as strings
                    });
                }

                // Handle countries form array - MODIFIED SECTION
                this.productForm.setControl('countries', this.fb.array([]));
                const countriesArray = this.productForm.get('countries') as FormArray;

                // Create a map of existing product countries for quick lookup
                const productCountriesMap = new Map();
                if (res.product.countries && res.product.countries.length > 0) {
                    res.product.countries.forEach((country: any) => {
                        productCountriesMap.set(country.id, {
                            where_to_buy_link: country.pivot?.where_to_buy_link || '',
                            available_in_pharmacies: Number(country.pivot?.available_in_pharmacies || 0)
                        });
                    });
                }

                // Loop through ALL countries from the countriesList and add them
                this.countriesList.forEach((country) => {
                    const existingData = productCountriesMap.get(country.id);

                    countriesArray.push(
                        this.fb.group({
                            country_id: [country.id],
                            where_to_buy_link: [existingData?.where_to_buy_link || ''],
                            available_in_pharmacies: [existingData?.available_in_pharmacies || 0]
                        })
                    );
                });

                // Set images for preview
                this.displayedThumbnail = res.product.thumbnail || null;
                this.displayedMainImage = res.product.main_image || null;

                this.changeDetectorRef.detectChanges();
            },
            error: (err) => {
                console.error('Error fetching product:', err);
            }
        });
    }

    onUpload(event: any) {
        const files = event.files; // Get uploaded files
        const imagesArray = this.productForm.get('images') as FormArray;

        imagesArray.clear(); // Reset images array before adding new ones
        this.displayedImages = []; // Clear the preview array

        for (let file of files) {
            if (file instanceof File) {
                imagesArray.push(this.fb.control(file)); // Store File object
                this.displayedImages.push(URL.createObjectURL(file)); // Generate preview URL
            } else {
                console.error('Invalid file detected!', file);
            }
        }
    }

    onFileSelect(event: any, type: string) {
        const file = event.files[0]; // Get first file

        if (!file) {
            console.error(`No file selected for ${type}`);
            return;
        }

        if (type === 'thumbnail') {
            this.productForm.patchValue({ thumbnail: file });
            this.displayedThumbnail = URL.createObjectURL(file);
        } else if (type === 'image') {
            this.displayedMainImage = URL.createObjectURL(file);
        }
    }

    submitForm() {
        if (this.id !== 'add') {
            this.updateProduct();
        } else {
            this.AddProduct();
        }
    }

    getBrands() {
        this.brandService.getBrands().subscribe({
            next: (res) => {
                this.brands = res.brands;
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    AddProduct() {
        const formData = new FormData();

        // Append basic fields (excluding images and countries)
        Object.keys(this.productForm.controls).forEach((key) => {
            const value = this.productForm.get(key)?.value;
            if (key !== 'images' && key !== 'countries' && value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        // ✅ Append countries in a fully validated way
        const countriesArray = this.productForm.get('countries')?.value || [];
        countriesArray.forEach((country: any, index: number) => {
            const countryId = country.country_id;
            const link = country.where_to_buy_link?.trim();
            const pharmacy = country.available_in_pharmacies;

            formData.append(`countries[${index}][country_id]`, String(countryId));
            formData.append(`countries[${index}][where_to_buy_link]`, link);
            formData.append(`countries[${index}][available_in_pharmacies]`, pharmacy); // safer than "true"
        });

        const imagesArray = this.productForm.get('images') as FormArray;
        imagesArray.controls.forEach((control) => {
            const file = control.value;
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
                this.router.navigate(['/pages/products']);
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    updateProduct() {
        const formData = new FormData();

        // Append all form fields except 'images' and 'countries'
        Object.keys(this.productForm.controls).forEach((key) => {
            const value = this.productForm.get(key)?.value;

            if (key !== 'images' && key !== 'countries' && value) {
                formData.append(key, value);
            }
        });

        // ✅ Append countries correctly
        const countriesArray = this.productForm.get('countries')?.value || [];
        countriesArray.forEach((country: any, index: number) => {
            const countryId = country.country_id;
            const link = country.where_to_buy_link?.trim();
            const pharmacy = country.available_in_pharmacies;

            formData.append(`countries[${index}][country_id]`, String(countryId));
            formData.append(`countries[${index}][where_to_buy_link]`, link);
            formData.append(`countries[${index}][available_in_pharmacies]`, pharmacy); // safer than "true"
        });

        // ✅ Append images correctly
        const imagesArray = this.productForm.get('images') as FormArray;
        imagesArray.controls.forEach((control) => {
            const file = control.value;
            if (file instanceof File) {
                formData.append('images[]', file);
            }
        });

        // ✅ Append thumbnail and main_image
        const thumbnail = this.productForm.get('thumbnail')?.value;
        if (thumbnail instanceof File) {
            formData.append('thumbnail', thumbnail);
        }

        this.ProductsService.UpdateProduct(this.id, formData).subscribe({
            next: (res) => {
                console.log(res);
                this.router.navigate(['/pages/products']);
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    getAvailableInPharmaciesControl(i: number): FormControl {
        return this.countriesControls[i].get('available_in_pharmacies') as FormControl;
    }
}
