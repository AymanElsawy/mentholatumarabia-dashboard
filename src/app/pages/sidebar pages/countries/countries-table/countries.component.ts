import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { CountriesService } from '../../../../core/services/countries.service';
import { TableDataComponent, TableColumn } from '../../../../core/components/table-data/table-data.component';
import { rxResource } from '@angular/core/rxjs-interop';

interface Country {
  id: string
  name_en: string
  name_ar: string
  created_at: string
  updated_at: string
}

@Component({
  selector: 'app-countries',
  imports: [
    ButtonModule,
    RouterLink,
    TableDataComponent
  ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent {
  private country = inject(CountriesService);
  private router = inject(Router);

  countriesResource = rxResource({
    stream: () => this.country.getCountries()
  });

  countries = computed(() => this.countriesResource.value()?.countries ?? []);
  loading = computed(() => this.countriesResource.isLoading());

  tableColumns: TableColumn[] = [
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'name_en', header: 'English Name', type: 'link', linkPrefix: '/pages/countries' },
    { field: 'name_ar', header: 'Arabic Name', type: 'link', linkPrefix: '/pages/countries' }
  ];
  globalFilterFields: string[] = ['id', 'name_en', 'name_ar'];

  deleteCountry(brandId: string) {
    this.country.DeleteCountry(brandId).subscribe(() => {
      this.countriesResource.reload();
    });
  }
}