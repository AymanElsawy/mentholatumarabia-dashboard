import { ButtonModule } from 'primeng/button';
import { Component, inject, computed, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageHeaderComponent } from '../../../../core/components/page-header/page-header.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { getFaqFormConfig } from '../constants/single-product-faq.constants';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FaqFormComponent } from '../components/faq-form/faq-form.component';

@Component({
    selector: 'app-single-product-faq',
    standalone: true,
    imports: [ButtonModule, PageHeaderComponent, ProgressSpinnerModule, FaqFormComponent],
    templateUrl: './single-product-faq.component.html',
    styleUrl: './single-product-faq.component.scss'
})
export class SingleProductFAQComponent {
    private fb = inject(FormBuilder);
    private productsService = inject(ProductsService);
    private activatedRoute = inject(ActivatedRoute);

    id = toSignal(this.activatedRoute.paramMap.pipe(map(p => p.get('id'))));

    faqForm: FormGroup = this.fb.group(getFaqFormConfig(''));
    editId = signal<number | null>(null);

    formVisible = signal(false);
    formMode = signal<'add' | 'edit'>('add');
    submitting = signal<boolean>(false);
    faqsResource = rxResource({
        params: () => this.id(),
        stream: ({ params: id }) => {
            if (id) {
                return this.productsService.getAllProductFAQS(id);
            }
            return of(null);
        }
    });

    loading = computed(() => this.faqsResource.isLoading());
    faqs = computed(() => this.faqsResource.value()?.faqs || []);

    constructor() {
        effect(() => {
            const currentId = this.id();
            if (currentId) {
                this.faqForm = this.fb.group(getFaqFormConfig(currentId));
            }
        });
    }

    sanitizeAnswer(answer: string): string {
        return answer ? answer.replace(/&nbsp;/g, ' ') : '';
    }

    showDialog() {
        this.formMode.set('add');
        this.formVisible.set(true);
        this.faqForm.reset({ product_id: this.id() });
    }

    editFAQ(faq: any) {
        this.formMode.set('edit');
        this.editId.set(faq.id);

        this.faqForm.patchValue({
            product_id: this.id(),
            question_en: faq.question_en,
            question_ar: faq.question_ar,
            answer_en: this.sanitizeAnswer(faq.answer_en),
            answer_ar: this.sanitizeAnswer(faq.answer_ar)
        });

        setTimeout(() => {
            this.faqForm.patchValue({
                answer_en: this.sanitizeAnswer(faq.answer_en),
                answer_ar: this.sanitizeAnswer(faq.answer_ar)
            });
        });

        this.formVisible.set(true);
    }

    handleSave() {
        if (this.formMode() === 'add') {
            this.addfaq();
        } else {
            this.submitEdit();
        }
    }

    private addfaq() {
        this.submitting.set(true);
        this.faqForm.patchValue({ product_id: this.id() });

        if (this.faqForm.invalid) {
            this.faqForm.markAllAsTouched();
            return;
        }

        this.productsService.createFAQ(this.faqForm.value).subscribe({
            next: () => {
                this.faqsResource.reload();
                this.formVisible.set(false);
                this.faqForm.reset({ product_id: this.id() });
                this.submitting.set(false);
            },
            error: (err) => {
                this.submitting.set(false);
                console.log(err)
            }
        });
    }

    private submitEdit() {
        this.submitting.set(true);
        if (this.faqForm.invalid) {
            this.faqForm.markAllAsTouched();
            return;
        }

        const currentEditId = this.editId();
        if (!currentEditId) return;

        this.productsService.updateFaq(this.faqForm.value, currentEditId).subscribe({
            next: () => {
                this.formVisible.set(false);
                this.faqsResource.reload();
                this.faqForm.reset({ product_id: this.id() });
                this.editId.set(null);
                this.submitting.set(false);
            },
            error: (err) => {
                this.submitting.set(false);
                console.log(err)
            }
        });
    }

    deleteFAQ(id: any) {
        this.productsService.deleteFaq(id).subscribe({
            next: () => this.faqsResource.reload(),
            error: (err) => console.log(err)
        });
    }
}
