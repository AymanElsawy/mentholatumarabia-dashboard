import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { BlogsService } from '../../../../core/services/blogs.service';
import { TableDataComponent, TableColumn } from '../../../../core/components/table-data/table-data.component';
import { rxResource } from '@angular/core/rxjs-interop';

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
  imports: [
    ButtonModule,
    RouterLink,
    TableDataComponent
  ],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
  private blogs = inject(BlogsService);
  private router = inject(Router);

  blogsResource = rxResource({
    stream: () => this.blogs.getBlogs()
  });

  BlogsList = computed(() => this.blogsResource.value()?.blogs ?? []);
  loading = computed(() => this.blogsResource.isLoading());

  tableColumns: TableColumn[] = [
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'title_en', header: 'English Name', type: 'link', linkPrefix: '/pages/blogs' },
    { field: 'title_ar', header: 'Arabic Name', type: 'link', linkPrefix: '/pages/blogs' }
  ];
  globalFilterFields: string[] = ['id', 'title_en', 'title_ar'];

  deleteBlog(brandId: any) {
    this.blogs.deleteBlog(brandId).subscribe(() => {
      this.blogsResource.reload();
    });
  }
}