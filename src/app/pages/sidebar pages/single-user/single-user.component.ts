import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminsService } from '../../../core/services/admins.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';

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
    PasswordModule
  ],
  templateUrl: './single-user.component.html',
  styleUrl: './single-user.component.scss',
  providers: [MessageService]
})
export class SingleUserComponent implements OnInit {
  id!: string | null;
  adminForm!: FormGroup;
  isEditMode: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private admins: AdminsService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''] // password validator added dynamically later
    });

    this.activatedRoute.paramMap.subscribe((p) => {
      this.id = p.get('id');

      if (this.id && this.id !== 'add') {
        this.isEditMode = true;
        this.getData();
      } else {
        this.isEditMode = false;
        // ✅ Add required validators for password only in create mode
        this.adminForm.get('password')?.setValidators([Validators.required, Validators.minLength(5)]);
        this.adminForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  getData() {
    if (!this.id) return;

    this.loading = true;
    this.admins.getSingleAdmin(Number(this.id)).subscribe({
      next: (res) => {
        this.adminForm.patchValue({
          name: res.user.name,
          email: res.user.email,
          password: '' // leave empty (not required in edit)
        });
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const formValue = this.adminForm.value;
    this.loading = true;

    const handleError = (err: any) => {
      console.error(err);
      this.loading = false;

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

    if (this.isEditMode && this.id) {
      if (!formValue.password) {
        delete formValue.password;
      }

      this.admins.updateAdmin(formValue, Number(this.id)).subscribe({
        next: (res) => {
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: res?.message || 'Admin updated successfully',
            life: 3000
          });

          // ✅ Give user time to see the toast
          setTimeout(() => this.router.navigate(['/pages/admins']), 1000);
        },
        error: handleError
      });
    } else {
      this.admins.createAdmin(formValue).subscribe({
        next: (res) => {
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: res?.status === 'success' ? 'Success' : 'Created',
            detail: res?.message || 'Admin created successfully',
            life: 3000
          });

          // ✅ Delay navigation so the toast can show
          setTimeout(() => this.router.navigate(['/pages/admins']), 1000);
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
