import { CategoriesService } from '../../../../core/services/categories.service';
import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { TableDataComponent, TableColumn } from '../../../../core/components/table-data/table-data.component';
import { rxResource } from '@angular/core/rxjs-interop';

interface Category {
    id: string;
    name_en: string;
    name_ar: string;
}

@Component({
    selector: 'app-categories',
    imports: [
        ButtonModule,
        RouterLink,
        TableDataComponent
    ],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent {
    private categories = inject(CategoriesService);
    private router = inject(Router);

    categoriesResource = rxResource({
        stream: () => this.categories.getCategories()
    });

    categoriesList = computed(() => this.categoriesResource.value()?.categories ?? []);
    loading = computed(() => this.categoriesResource.isLoading());

    tableColumns: TableColumn[] = [
        { field: 'id', header: 'ID', type: 'text' },
        { field: 'name_en', header: 'English Name', type: 'link', linkPrefix: '/pages/categories' },
        { field: 'name_ar', header: 'Arabic Name', type: 'link', linkPrefix: '/pages/categories' },
        { field: 'created_at', header: 'Created At', type: 'date' },
        { field: 'image', header: 'Image', type: 'image' },
    ];
    globalFilterFields: string[] = ['id', 'name_en', 'name_ar'];

    deleteCategory(categoryId: string) {
        this.categories.DeleteCategory(categoryId).subscribe(() => {
            this.categoriesResource.reload();
        });
    }
}
