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
import { BlogsService } from '../../../core/services/blogs.service';

export interface Blog {
  id: number
  title_en: string
  title_ar: string
  excerpt_en: string
  excerpt_ar: string
  content_en: string
  content_ar: string
  meta_title_en: any
  meta_title_ar: any
  meta_description_en: any
  meta_description_ar: any
  meta_keywords_en: any
  meta_keywords_ar: any
  thumbnail: string
  image: string
  created_at: string
  updated_at: string
}
@Component({
  selector: 'app-blogs',
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
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
 BlogsList:Blog []=[]
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  displayConfirmation: boolean = false;



constructor(private blogs:BlogsService,private router:Router){

}
  ngOnInit(): void {
    this.loading = true;

    this.blogs.getBlogs().subscribe({
      
      next:(res)=>{console.log(res);
        this.loading = false;
        this.BlogsList=res.blogs
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
deleteCountry(brandId:any) {
  
  this.blogs.deleteBlog(brandId).subscribe(() => {
    this.BlogsList = this.BlogsList.filter(blog => blog.id !== brandId);
  });

}

}