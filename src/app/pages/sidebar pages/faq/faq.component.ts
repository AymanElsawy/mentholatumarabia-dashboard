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
import { ProductsService } from '../../../core/services/products.service';
interface Product {
    id: string
    name_en: string
    name_ar: string
    description_en: string
    description_ar: string
    details_en: string
    details_ar: string
    meta_title_en: string
    meta_title_ar: string
    meta_description_en: string
    meta_description_ar: string
    meta_keywords_en: string
    meta_keywords_ar: string
    images: string[]
    thumbnail: string
    main_image: string
    created_at: string
    updated_at: string
    brand_id: number
    brand: Brand
  }
   export interface Brand {
    id: number
    name_en: string
    name_ar: string
    created_at: string
    updated_at: string
  }
interface expandedRows {
    [key: string]: boolean;
}
@Component({
  selector: 'app-faq',
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
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
products:Product []=[]
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  displayConfirmation: boolean = false;



constructor(private Product:ProductsService,private router:Router){

}
  ngOnInit(): void {
    this.loading = true;

    this.Product.getProducts().subscribe({
      
      next:(res)=>{console.log(res);
        this.products=res.products       
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

selectedProductId: string | null = null; 

openConfirmation(productId: string) {
  this.selectedProductId = productId; 
  this.displayConfirmation = true;
}

closeConfirmation(confirmed: boolean) {
  this.displayConfirmation = false;
  
  if (confirmed && this.selectedProductId) {
    this.deleteProduct(this.selectedProductId);
  }
}

// Example action after confirmation
deleteProduct(productId: string) {
this.Product.DeleteProduct(productId).subscribe(() => {
    this.products = this.products.filter(country => country.id !== productId);
  });

}

}