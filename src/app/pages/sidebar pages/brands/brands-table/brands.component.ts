import { BrandsService } from '../../../../core/services/brands.service';
import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { TableDataComponent, TableColumn } from '../../../../core/components/table-data/table-data.component';
import { rxResource } from '@angular/core/rxjs-interop';

interface Brand {
    id: string;
    name_en: string;
    name_ar: string;
}

@Component({
    selector: 'app-brands',
    imports: [
        ButtonModule,
        RouterLink,
        TableDataComponent
    ],
    templateUrl: './brands.component.html',
    styleUrl: './brands.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class BrandsComponent {
    private brands = inject(BrandsService);
    private router = inject(Router);

    brandsResource = rxResource({
        stream: () => this.brands.getBrands()
    });

    brandsList = computed(() => this.brandsResource.value()?.brands ?? []);
    loading = computed(() => this.brandsResource.isLoading());

    tableColumns: TableColumn[] = [
        { field: 'id', header: 'ID', type: 'text' },
        { field: 'name_en', header: 'English Name', type: 'link', linkPrefix: '/pages/brands' },
        { field: 'name_ar', header: 'Arabic Name', type: 'link', linkPrefix: '/pages/brands' },
        { field: 'created_at', header: 'Created At', type: 'date' },
        { field: 'image', header: 'Image', type: 'image' },
    ];
    globalFilterFields: string[] = ['id', 'name_en', 'name_ar'];

    deleteBrand(brandId: string) {
        this.brands.DeleteBrand(brandId).subscribe(() => {
            this.brandsResource.reload();
        });
    }
}
