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
// import { Customer, CustomerService, Representative } from '../service/customer.service';
// import { Product, ProductService } from '../service/product.service';
import { DialogModule } from 'primeng/dialog';
import { CountriesService } from '../../../core/services/countries.service';

interface Country {
  id: string
  name_en: string
  name_ar: string
  created_at: string
  updated_at: string
}
interface expandedRows {
    [key: string]: boolean;
}
@Component({
  selector: 'app-countries',
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
   IconFieldModule,RouterLink],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent {
 countries:Country []=[]
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  displayConfirmation: boolean = false;



constructor(private country:CountriesService,private router:Router){

}
  ngOnInit(): void {
    this.loading = true;

    this.country.getCountries().subscribe({
      
      next:(res)=>{console.log(res);
        this.countries=res.countries       
        this.loading = false;
      },error:(err)=>{
        console.log(err);
        this.loading = false;

        
      }
    })
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}
clear(table: Table) {
  table.clear();
  this.filter.nativeElement.value = '';
}

selectedBrandId: string | null = null; // Store the brand ID temporarily

openConfirmation(brandId: string) {
  this.selectedBrandId = brandId; // Store brand ID
  this.displayConfirmation = true;
}

// Handle confirmation and call deleteBrand() if confirmed
closeConfirmation(confirmed: boolean) {
  this.displayConfirmation = false;
  
  if (confirmed && this.selectedBrandId) {
    this.deleteCountry(this.selectedBrandId);
  }
}

// Example action after confirmation
deleteCountry(brandId: string) {
  this.country.DeleteCountry(brandId).subscribe(() => {
    this.countries = this.countries.filter(country => country.id !== brandId);
  });

}

}