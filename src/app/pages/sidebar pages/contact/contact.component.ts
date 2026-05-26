import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { TableDataComponent, TableColumn, TableAction } from '../../../core/components/table-data/table-data.component';
import { rxResource } from '@angular/core/rxjs-interop';

export interface Contact {
    id: number;
    name: string;
    email: string;
    type: string;
    reason: string;
    created_at: any;
    updated_at: any;
}

@Component({
    selector: 'app-contact',
    imports: [
        ButtonModule,
        TableDataComponent
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    private contact = inject(ContactService);
    private router = inject(Router);

    contactResource = rxResource({
        stream: () => this.contact.getContact()
    });

    ContactList = computed(() => this.contactResource.value()?.contacts ?? []);
    loading = computed(() => this.contactResource.isLoading());

    tableColumns: TableColumn[] = [
        { field: 'name', header: 'Name', type: 'text' },
        { field: 'email', header: 'Email', type: 'text' },
        { field: 'type', header: 'Type', type: 'text' },
        { field: 'reason', header: 'Reason', type: 'text' },
    ];
    globalFilterFields: string[] = ['name', 'email', 'type', 'reason'];
    
    customActions: TableAction[] = [
        { 
            icon: 'pi pi-pencil', 
            label: 'Reply', 
            getHref: (item) => 'mailto:' + item.email 
        }
    ];
}
