import { BlogsService } from '../../../../core/services/blogs.service';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadComponent } from '../../../../core/components/file-upload/file-upload.component';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef, Component, inject, PLATFORM_ID, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { ToastModule } from 'primeng/toast';
import { isPlatformBrowser } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import Quill from 'quill';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PageHeaderComponent } from '../../../../core/components/page-header/page-header.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { BLOG_FORM_LABELS, getBlogFormConfig } from '../constants/single-blog.constants';

@Component({
    selector: 'app-single-blog',
    imports: [ToastModule, FluidModule, FileUploadComponent, FieldsetModule, TextareaModule, ReactiveFormsModule, ButtonModule, InputTextModule, EditorModule, ProgressSpinnerModule, PageHeaderComponent],
    templateUrl: './single-blog.component.html',
    styleUrl: './single-blog.component.scss'
})
export class SingleBlogComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private activatedRoute = inject(ActivatedRoute);
    private blogs = inject(BlogsService);
    private cd = inject(ChangeDetectorRef);
    private platformId = inject(PLATFORM_ID);

    id = toSignal(this.activatedRoute.paramMap.pipe(map(p => p.get('id'))));

    blogForm: FormGroup = this.fb.group(getBlogFormConfig());

    submitting = signal(false);

    blogResource = rxResource({
        params: () => this.id(),
        stream: ({ params: id }) => {
            if (id && id !== 'add') {
                return this.blogs.getSingleBlog(id);
            }
            return of(null);
        }
    });

    loading = computed(() => this.blogResource.isLoading());

    constructor() {
        effect(() => {
            const res = this.blogResource.value();
            if (res && res.blog) {
                const blogData = { ...res.blog };
                if (blogData.thumbnail) blogData.thumbnail = blogData.thumbnail.replace(/\/{2,}/g, '/');
                if (blogData.image) blogData.image = blogData.image.replace(/\/{2,}/g, '/');
                this.blogForm.patchValue(blogData);
            }
        });
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            new Quill('#editor', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ align: [] }],
                        ['image']
                    ]
                }
            });
        }
    }

    async submitForm() {
        if (this.blogForm.invalid) {
            this.blogForm.markAllAsTouched();
            return;
        }

        this.submitting.set(true);
        const formData = new FormData();

        Object.keys(this.blogForm.value).forEach((key) => {
            const val = this.blogForm.value[key];
            if (val && key !== 'thumbnail' && key !== 'image') {
                formData.append(key, val);
            }
        });

        const thumbnail = this.blogForm.get('thumbnail')?.value;
        if (thumbnail instanceof File) {
            formData.append('thumbnail', thumbnail);
        }

        const image = this.blogForm.get('image')?.value;
        if (image instanceof File) {
            formData.append('image', image);
        }

        const currentId = this.id();
        const request = currentId !== 'add' && currentId ? this.blogs.updateBlog(formData, currentId) : this.blogs.createBlog(formData);

        request.subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Blog saved successfully',
                    life: 3000
                });
                this.router.navigate(['/pages/blogs']);
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



    getFieldErrorMessage(fieldName: string): string {
        const field = this.blogForm.get(fieldName);

        if (field?.errors) {
            if (field.errors['required']) {
                return `${this.toLabel(fieldName)} is required.`;
            }
            if (field.errors['minlength']) {
                const len = field.errors['minlength'].requiredLength;
                return `${this.toLabel(fieldName)} must be at least ${len} characters.`;
            }
            if (field.errors['maxlength']) {
                const len = field.errors['maxlength'].requiredLength;
                return `${this.toLabel(fieldName)} must be at most ${len} characters.`;
            }
        }

        return '';
    }

    toLabel(fieldName: string): string {
        return BLOG_FORM_LABELS[fieldName] || fieldName;
    }

    isFieldInvalid(fieldName: string): boolean | undefined {
        const control = this.blogForm.get(fieldName);
        return control?.invalid && (control.dirty || control.touched);
    }
}
