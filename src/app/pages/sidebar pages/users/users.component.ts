import { BrandsService } from '../../../core/services/brands.service';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Router, RouterLink } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { Brand } from '../products/products.component';
import { AdminsService } from '../../../core/services/admins.service';
import { Admin } from '../../../core/interfaces/admin';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  imports: [DialogModule,
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    RouterLink,
    RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [MessageService]
})
export class UsersComponent implements OnInit {
  adminsList: Admin[] = [];
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  displayConfirmation: boolean = false;

  constructor(
    private admins: AdminsService,
    private messageService: MessageService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.loading = true;

    this.admins.getUsers().subscribe({
      next: (res) => {
        this.adminsList = res.users.data;

        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  // getSeverity(status: string) {
  //   switch (status) {
  //       case 'qualified':
  //       case 'instock':
  //       case 'INSTOCK':
  //       case 'DELIVERED':
  //       case 'delivered':
  //           return 'success';

  //       case 'negotiation':
  //       case 'lowstock':
  //       case 'LOWSTOCK':
  //       case 'PENDING':
  //       case 'pending':
  //           return 'warn';

  //       case 'unqualified':
  //       case 'outofstock':
  //       case 'OUTOFSTOCK':
  //       case 'CANCELLED':
  //       case 'cancelled':
  //           return 'danger';

  //       default:
  //           return 'info';
  //   }
  // }

  // deleteBrand(id: string) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You won\'t be able to revert this!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result:any) => {
  //     if (result.isConfirmed) {
  //       // Call API to delete brand
  //       this.brands.DeleteBrand(id).subscribe(() => {
  //         // Remove deleted item from the list
  //         this.brandsList = this.brandsList.filter(brand => brand.id !== id);

  //         Swal.fire({
  //           title: 'Deleted!',
  //           text: 'The brand has been deleted.',
  //           icon: 'success'
  //         });
  //       });
  //     }
  //   });
  // }

  selectedAdminId: number | null = null; // Store the brand ID temporarily

  openConfirmation(adminId: number) {
    console.log(adminId);

    this.selectedAdminId = adminId;
    this.displayConfirmation = true;
  }

  // Handle confirmation and call deleteBrand() if confirmed
  closeConfirmation(confirmed: boolean) {
    this.displayConfirmation = false;

    if (confirmed && this.selectedAdminId) {
      this.deleteAdmin(this.selectedAdminId);
    }
  }

  // Example action after confirmation
  deleteAdmin(id: number) {
    console.log(id);

    this.admins.deleteAdmin(id).subscribe({
      next: () => {
        this.adminsList = this.adminsList.filter((admin) => admin.id !== id);

        this.messageService.add({
          severity: 'success',
          summary: 'Admin Deleted',
          detail: 'The admin was deleted successfully.',
          life: 3000
        });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete the admin. Please try again.',
          life: 3000
        });
      }
    });
  }

}

