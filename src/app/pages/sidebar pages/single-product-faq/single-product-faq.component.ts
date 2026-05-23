import { ButtonModule } from 'primeng/button';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { NgFor } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';

@Component({
    selector: 'app-single-product-faq',
    standalone: true,
    imports: [NgFor, ButtonModule, DialogModule, InputTextModule, TextareaModule, ReactiveFormsModule, EditorModule],
    templateUrl: './single-product-faq.component.html',
    styleUrl: './single-product-faq.component.scss'
})
export class SingleProductFAQComponent {
    id!: string;
    productData: any;
    faqs: any[] = [];
    faqForm!: FormGroup;
    editId: number | null = null;

    visible = false;
    visibleEdit = false;

    // Editor configuration for RTL support
    editorConfig = {
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ align: [] }],
                [{ list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ direction: 'rtl' }],
                ['clean']
            ]
        },
        placeholder: 'Enter your text here...',
        theme: 'snow'
    };

    private ProductsService = inject(ProductsService);

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.activatedRoute.paramMap.subscribe((p) => {
            this.id = p.get('id') as string;
            this.getData();
        });
    }

    ngOnInit() {
        this.faqForm = this.fb.group({
            product_id: [this.id],
            question_en: ['', Validators.required],
            question_ar: ['', Validators.required],
            answer_en: ['', Validators.required],
            answer_ar: ['', Validators.required]
        });
    }

    isInvalid(controlName: string): boolean {
        const control = this.faqForm.get(controlName);
        return !!(control && control.invalid && control.touched);
    }

    sanitizeAnswer(answer: string): string {
        return answer ? answer.replace(/&nbsp;/g, ' ') : '';
    }

    getData() {
        this.ProductsService.getAllProductFAQS(this.id).subscribe({
            next: (res) => {
                this.productData = res.product;
                this.faqs = res.faqs;
            },
            error: (err) => {
                console.error('Error fetching product:', err);
            }
        });
    }

    addfaq() {
        this.faqForm.patchValue({ product_id: this.id });

        if (this.faqForm.invalid) {
            this.faqForm.markAllAsTouched();
            return;
        }

        this.ProductsService.createFAQ(this.faqForm.value).subscribe({
            next: () => {
                this.getData();
                this.visible = false;
                this.faqForm.reset({ product_id: this.id });
            },
            error: (err) => console.log(err)
        });
    }

    editFAQ(faq: any) {
        this.editId = faq.id;

        // Ensure the form is updated after editor initializes
        this.faqForm.patchValue({
            product_id: this.id,
            question_en: faq.question_en,
            question_ar: faq.question_ar,
            answer_en: this.sanitizeAnswer(faq.answer_en),
            answer_ar: this.sanitizeAnswer(faq.answer_ar)
        });

        // In case editor needs delay to render values
        setTimeout(() => {
            this.faqForm.patchValue({
                answer_en: this.sanitizeAnswer(faq.answer_en),
                answer_ar: this.sanitizeAnswer(faq.answer_ar)
            });
        });

        this.showDialogEdit();
    }

    submitEdit() {
        if (this.faqForm.invalid) {
            this.faqForm.markAllAsTouched();
            return;
        }

        if (!this.editId) return;

        this.ProductsService.updateFaq(this.faqForm.value, this.editId).subscribe({
            next: () => {
                this.visibleEdit = false;
                this.getData();
                this.faqForm.reset({ product_id: this.id });
                this.editId = null;
            },
            error: (err) => console.log(err)
        });
    }

    deleteFAQ(id: any) {
        this.ProductsService.deleteFaq(id).subscribe({
            next: () => this.getData(),
            error: (err) => console.log(err)
        });
    }

    showDialog() {
        this.visible = true;
        this.faqForm.reset({ product_id: this.id });
    }

    showDialogEdit() {
        this.visibleEdit = true;
    }
}
