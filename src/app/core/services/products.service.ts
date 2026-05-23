import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    getCountries() {
        throw new Error('Method not implemented.');
    }

    baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/products?brand_id=`, { headers });
    }

    getSingleProduct(id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/products/${id}`, { headers });
    }
    getAllProductFAQS(id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/products/${id}/faqs`, { headers });
    }
    // api/dashboard/products/faqs
    createFAQ(formBody: string): Observable<any> {
        const token = localStorage.getItem('dbToken');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/products/faqs`, formBody, { headers });
    }

    updateFaq(formBody: string, id: any): Observable<any> {
        const token = localStorage.getItem('dbToken');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/products/faqs/${id}`, formBody, { headers });
    }

    deleteFaq(id: any): Observable<any> {
        const token = localStorage.getItem('dbToken');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.delete(`${this.baseUrl}api/dashboard/products/faqs/${id}`, { headers });
    }
    DeleteProduct(id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.delete(`${this.baseUrl}api/dashboard/products/${id}`, { headers });
    }

    UpdateProduct(id: string, form: any): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        const formData = this.createUpdateFormData(form);
        for (let pair of formData.entries()) {
        }
        return this.http.post(`${this.baseUrl}api/dashboard/products/${id}`, formData, { headers });
    }

    private createUpdateFormData(form: any): FormData {
        if (form instanceof FormData) {

            form.delete('countries');

            const countriesValue = form.get('countries');
            if (countriesValue && typeof countriesValue === 'string') {
                const countriesArray = JSON.parse(countriesValue); // Convert back to an array

                countriesArray.forEach((country: { country_id: string; where_to_buy_link: string }, index: number) => {
                    form.append(`countries[${index}][country_id]`, country.country_id);
                    form.append(`countries[${index}][where_to_buy_link]`, country.where_to_buy_link);
                });
            } else {
                console.warn('🚨 No valid "countries" data found in FormData!');
            }

            for (let pair of form.entries()) {
            }
            return form;
        }

        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            if (!['images', 'thumbnail', 'main_image', 'countries'].includes(key) && form[key] !== undefined) {
                formData.append(key, form[key]);
            }
        });

        // 🔹 Append 'countries' correctly
        if (Array.isArray(form.countries)) {
            form.countries.forEach((country: { country_id: string; where_to_buy_link: string }, index: number) => {
                formData.append(`countries[${index}][country_id]`, country.country_id);
                formData.append(`countries[${index}][where_to_buy_link]`, country.where_to_buy_link);
            });
        } else {
            console.warn('🚨 "countries" is not an array or is missing!', form.countries);
        }

        // 🔹 Append images correctly
        if (form.thumbnail instanceof File) {
            formData.append('thumbnail', form.thumbnail);
        }
        if (form.main_image instanceof File) {
            formData.append('main_image', form.main_image);
        }
        if (Array.isArray(form.images)) {
            form.images.forEach((file: File) => {
                formData.append('images[]', file);
            });
        }

        for (let pair of formData.entries()) {
        }

        return formData;
    }

    AddProduct(form: any): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        const formData = this.createFormData(form);

        return this.http.post(`${this.baseUrl}api/dashboard/products`, formData, { headers });
    }

    private createFormData(form: any): FormData {
        if (form instanceof FormData) {
            return form; // Return the existing FormData to avoid loss
        }

        const formData = new FormData();

        // Append required fields
        const requiredFields = ['brand_id', 'name_en', 'name_ar', 'description_en', 'description_ar', 'details_en', 'details_ar', 'meta_title_en', 'meta_title_ar', 'meta_description_en', 'meta_description_ar', 'meta_keywords_en', 'meta_keywords_ar'];

        requiredFields.forEach((key) => {
            if (form[key] !== undefined && form[key] !== null) {
                formData.append(key, form[key]);
            }
        });

        // Handle images
        if (form.thumbnail instanceof File) {
            formData.append('thumbnail', form.thumbnail);
        }

        if (form.main_image instanceof File) {
            formData.append('main_image', form.main_image);
        }

        if (Array.isArray(form.images)) {
            form.images.forEach((file: File, index: number) => {
                if (file instanceof File) {
                    formData.append('images[]', file);
                }
            });
        }

        // Handle countries array (no JSON.stringify needed)
        if (Array.isArray(form.countries) && form.countries.length > 0) {
            form.countries.forEach((country: any, index: number) => {
                if (country.country_id) {
                    formData.append(`countries[${index}][country_id]`, country.country_id);
                }
                if (country.where_to_buy_link) {
                    formData.append(`countries[${index}][where_to_buy_link]`, country.where_to_buy_link);
                }
            });
        }

        return formData;
    }
}
