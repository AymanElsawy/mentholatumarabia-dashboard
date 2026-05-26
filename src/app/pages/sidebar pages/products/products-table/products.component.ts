
import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { TableDataComponent, TableColumn } from '../../../../core/components/table-data/table-data.component';
import { rxResource } from '@angular/core/rxjs-interop';

export interface Product {
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

@Component({
  selector: 'app-products',
  imports: [
    ButtonModule,
    RouterLink,
    TableDataComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private Product = inject(ProductsService);
  private router = inject(Router);

  productsResource = rxResource({
    stream: () => this.Product.getProducts()
  });

  products = computed(() => this.productsResource.value()?.products ?? []);
  loading = computed(() => this.productsResource.isLoading());

  tableColumns: TableColumn[] = [
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'name_en', header: 'English Name', type: 'link', linkPrefix: '/pages/products' },
    { field: 'name_ar', header: 'Arabic Name', type: 'link', linkPrefix: '/pages/products' },
    { field: 'brand.name_en', header: 'Brand English', type: 'link', linkPrefix: '/pages/products' },
    { field: 'brand.name_ar', header: 'Brand Arabic', type: 'link', linkPrefix: '/pages/products' }
  ];
  globalFilterFields: string[] = ['id', 'name_en', 'name_ar', 'brand_en', 'brand_ar'];

  deleteProduct(productId: string) {
    this.Product.DeleteProduct(productId).subscribe(() => {
      this.productsResource.reload();
    });
  }
}