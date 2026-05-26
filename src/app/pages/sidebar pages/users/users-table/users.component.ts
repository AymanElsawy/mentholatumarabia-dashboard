import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AdminsService } from '../../../../core/services/admins.service';
import { Admin } from '../../../../core/interfaces/admin';
import { MessageService } from 'primeng/api';
import { TableDataComponent, TableColumn } from '../../../../core/components/table-data/table-data.component';
import { ToastModule } from 'primeng/toast';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    TableDataComponent,
    ToastModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [MessageService]
})
export class UsersComponent {
  private admins = inject(AdminsService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  adminsResource = rxResource({
    stream: () => this.admins.getUsers()
  });

  adminsList = computed(() => this.adminsResource.value()?.users.data ?? []);
  loading = computed(() => this.adminsResource.isLoading());

  tableColumns: TableColumn[] = [
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'name', header: 'Name', type: 'link', linkPrefix: '/pages/admins', isTitleCase: true },
    { field: 'email', header: 'Email', type: 'mailto' },
    { field: 'created_at', header: 'Created At', type: 'date' }
  ];
  globalFilterFields: string[] = ['id', 'name', 'email'];

  deleteAdmin(id: number) {
    this.admins.deleteAdmin(id).subscribe({
      next: () => {
        this.adminsResource.reload();
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

