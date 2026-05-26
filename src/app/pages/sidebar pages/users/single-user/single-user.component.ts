import { Component, ChangeDetectorRef, signal, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminsService } from '../../../../core/services/admins.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PageHeaderComponent } from '../../../../core/components/page-header/page-header.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { getAdminFormConfig } from '../constants/single-user.constants';

@Component({
  selector: 'app-single-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FileUploadModule,
    FieldsetModule,
    TextareaModule,
    ToastModule,
    PasswordModule,
    ProgressSpinnerModule,
    PageHeaderComponent
  ],
  templateUrl: './single-user.component.html',
  styleUrl: './single-user.component.scss'
})
export class SingleUserComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private admins = inject(AdminsService);
  private messageService = inject(MessageService);

  id = toSignal(this.activatedRoute.paramMap.pipe(map(p => p.get('id'))));
  isEditMode = computed(() => !!this.id() && this.id() !== 'add');

  submitting = signal(false);

  adminForm: FormGroup = this.fb.group(getAdminFormConfig());

  adminResource = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => {
      if (id && id !== 'add') {
        return this.admins.getSingleAdmin(Number(id));
      }
      return of(null);
    }
  });

  loading = computed(() => this.adminResource.isLoading());

  constructor() {
    effect(() => {
      const res = this.adminResource.value();
      if (res && res.user) {
        this.adminForm.patchValue({
          name: res.user.name,
          email: res.user.email,
          password: '' // leave empty (not required in edit)
        });
      }
    });

    effect(() => {
      const isEdit = this.isEditMode();
      const passwordControl = this.adminForm.get('password');
      if (isEdit) {
        passwordControl?.clearValidators();
      } else {
        passwordControl?.setValidators([Validators.required, Validators.minLength(5)]);
      }
      passwordControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const formValue = this.adminForm.value;
    this.submitting.set(true);

    const handleError = (err: any) => {
      console.error(err);
      this.submitting.set(false);

      let errorMessage = 'Something went wrong. Please try again.';
      if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.error?.errors) {
        const firstErrorKey = Object.keys(err.error.errors)[0];
        errorMessage = err.error.errors[firstErrorKey][0];
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 4000
      });
    };

    const currentId = this.id();

    if (this.isEditMode() && currentId) {
      if (!formValue.password) {
        delete formValue.password;
      }

      this.admins.updateAdmin(formValue, Number(currentId)).subscribe({
        next: (res) => {
          this.submitting.set(false);

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: res?.message || 'Admin updated successfully',
            life: 3000
          });

          this.router.navigate(['/pages/admins']);
        },
        error: handleError
      });
    } else {
      this.admins.createAdmin(formValue).subscribe({
        next: (res) => {
          this.submitting.set(false);

          this.messageService.add({
            severity: 'success',
            summary: res?.status === 'success' ? 'Success' : 'Created',
            detail: res?.message || 'Admin created successfully',
            life: 3000
          });

           this.router.navigate(['/pages/admins'])
        },
        error: handleError
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.adminForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getError(controlName: string): string {
    const control = this.adminForm.get(controlName);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('email')) return 'Invalid email format';
    if (control?.hasError('minlength')) return 'Too short';
    if (control?.hasError('maxlength')) return 'Too long';
    return '';
  }
}
