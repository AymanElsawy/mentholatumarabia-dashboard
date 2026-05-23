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

import { DialogModule } from 'primeng/dialog';
import { ContactService } from '../../../core/services/contact.service';
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
        DialogModule,
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
        IconFieldModule
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    ContactList: Contact[] = [];
    loading: boolean = true;
    @ViewChild('filter') filter!: ElementRef;
    displayConfirmation: boolean = false;

    constructor(
        private contact: ContactService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.loading = true;

        this.contact.getContact().subscribe({
            next: (res) => {
                this.ContactList = res.contacts;

                this.loading = false;
            },
            error: (err) => {
                console.log(err);
                this.loading = false;
            }
        });
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
}
