import { BlogsService } from '../../../core/services/blogs.service';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import Quill from 'quill';

@Component({
    selector: 'app-single-blog',
    imports: [NgIf, ToastModule, FluidModule, FileUploadModule, FieldsetModule, TextareaModule, ReactiveFormsModule, ButtonModule, InputTextModule,EditorModule],
    templateUrl: './single-blog.component.html',
    styleUrl: './single-blog.component.scss',
    providers: [MessageService]
})
export class SingleBlogComponent {
    id!: string;
    blogForm!: FormGroup;
    thumbnailFile: File | null = null;
    imageFile: File | null = null;
    displayedThumbnail: string | null = null;
    displayedMainImage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private blogs: BlogsService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.blogForm = this.fb.group({
            title_en: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
            title_ar: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
            content_en: ['', [Validators.required, Validators.minLength(20)]],
            content_ar: ['', [Validators.required, Validators.minLength(20)]],
            excerpt_en: ['', [Validators.required, Validators.maxLength(200)]],
            excerpt_ar: ['', [Validators.required, Validators.maxLength(200)]],
            thumbnail: ['', Validators.required],
            image: ['', Validators.required],
            meta_title_en: ['', [Validators.required, Validators.maxLength(60)]],
            meta_title_ar: ['', [Validators.required, Validators.maxLength(60)]],
            meta_description_en: ['', [Validators.required, Validators.maxLength(160)]],
            meta_description_ar: ['', [Validators.required, Validators.maxLength(160)]],
            meta_keywords_en: ['', [Validators.required]],
            meta_keywords_ar: ['', [Validators.required]]
        });

        this.activatedRoute.paramMap.subscribe((p) => {
            this.id = p.get('id') as string;
            if (this.id !== 'add') {
                this.getData();
            }
        });
    }


      private platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    // Only run in the browser
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
    getData() {
        this.blogs.getSingleBlog(this.id).subscribe({
            next: (res) => {
                this.blogForm.patchValue(res.blog);

                // Clean up the URL paths
                this.displayedThumbnail = res.blog.thumbnail?.replace(/\/{2,}/g, '/') || null;
                this.displayedMainImage = res.blog.image?.replace(/\/{2,}/g, '/') || null;

                this.thumbnailFile = null;
                this.imageFile = null;
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    async submitForm() {
        if (this.blogForm.invalid) {
            this.blogForm.markAllAsTouched();
            return;
        }

        // if (this.blogForm.invalid) return;

        const formData = new FormData();

        Object.keys(this.blogForm.value).forEach((key) => {
            if (this.blogForm.value[key] && key !== 'thumbnail' && key !== 'image') {
                formData.append(key, this.blogForm.value[key]);
            }
        });

        // Append images only if they are newly selected
        if (this.thumbnailFile instanceof File) {
            formData.append('thumbnail', this.thumbnailFile);
        }

        if (this.imageFile instanceof File) {
            formData.append('image', this.imageFile);
        }

        const request = this.id !== 'add' ? this.blogs.updateBlog(formData, this.id) : this.blogs.createBlog(formData);

        request.subscribe({
            next: (res) => {
                this.router.navigate(['/pages/blogs']);
            },
            error: (err) => {
                console.error('API Error:', err);
            }
        });
    }

    async urlToFile(imageUrl: string, fileName: string): Promise<File> {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
    }

    onFileSelect(event: any, controlName: 'thumbnail' | 'image') {
        const file = event.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);

            if (controlName === 'thumbnail') {
                this.thumbnailFile = file;
                this.displayedThumbnail = objectUrl;
            } else if (controlName === 'image') {
                this.imageFile = file;
                this.displayedMainImage = objectUrl;
            }

            this.cd.detectChanges();
            this.blogForm.controls[controlName].setValue(file);
            this.blogForm.controls[controlName].markAsTouched();
            this.blogForm.controls[controlName].updateValueAndValidity();
        }
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
        const map: any = {
            title_en: 'English title',
            title_ar: 'Arabic title',
            excerpt_en: 'English excerpt',
            excerpt_ar: 'Arabic excerpt',
            content_en: 'English content',
            content_ar: 'Arabic content',
            thumbnail: 'Thumbnail image',
            image: 'Main image',
            meta_title_en: 'Meta title (EN)',
            meta_title_ar: 'Meta title (AR)',
            meta_description_en: 'Meta description (EN)',
            meta_description_ar: 'Meta description (AR)',
            meta_keywords_en: 'Meta keywords (EN)',
            meta_keywords_ar: 'Meta keywords (AR)'
        };
        return map[fieldName] || fieldName;
    }

    isFieldInvalid(fieldName: string): boolean | undefined {
        const control = this.blogForm.get(fieldName);
        return control?.invalid && (control.dirty || control.touched);
    }
}
