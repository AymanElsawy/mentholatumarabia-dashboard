import { BrandsService } from '../../../core/services/brands.service';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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

interface Brand {
    id: string;
    name_en: string;
    name_ar: string;
}

@Component({
    selector: 'app-brands',
    imports: [
        DialogModule,
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
        RouterLink
    ],
    templateUrl: './brands.component.html',
    styleUrl: './brands.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class BrandsComponent implements OnInit {
    brandsList: Brand[] = [];
    loading: boolean = true;
    @ViewChild('filter') filter!: ElementRef;
    displayConfirmation: boolean = false;

    constructor(
        private brands: BrandsService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.loading = true;

        this.brands.getBrands().subscribe({
            next: (res) => {
                this.brandsList = res.brands;

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

    selectedBrandId: string | null = null; // Store the brand ID temporarily

    openConfirmation(brandId: string) {
        this.selectedBrandId = brandId; // Store brand ID
        this.displayConfirmation = true;
    }

    // Handle confirmation and call deleteBrand() if confirmed
    closeConfirmation(confirmed: boolean) {
        this.displayConfirmation = false;

        if (confirmed && this.selectedBrandId) {
            this.deleteBrand(this.selectedBrandId);
        }
    }

    // Example action after confirmation
    deleteBrand(brandId: string) {
        this.brands.DeleteBrand(brandId).subscribe(() => {
            this.brandsList = this.brandsList.filter((brand) => brand.id !== brandId);
        });
    }
}
