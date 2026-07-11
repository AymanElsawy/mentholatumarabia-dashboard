import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  field: string;
  header: string;
  type: 'text' | 'link' | 'image' | 'date' | 'mailto' | 'toggle';
  linkPrefix?: string; // used if type is 'link'
  isTitleCase?: boolean; // For formatting
}

export interface TableAction {
  icon: string;
  label?: string;
  severity?: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
  getRouterLink?: (item: any) => any[];
  getHref?: (item: any) => string;
  onClick?: (item: any) => void;
}

@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    SkeletonModule,
    DialogModule,
    ToggleSwitchModule,
    FormsModule
  ],
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.scss'
})
export class TableDataComponent {
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() columns: TableColumn[] = [];
  @Input() globalFilterFields: string[] = [];
  @Input() editRoutePrefix?: string;
  @Input() hasDelete: boolean = false;
  @Input() deleteEntityName: string = 'item';
  @Input() customActions: TableAction[] = [];
  
  @Output() delete = new EventEmitter<any>();
  @Output() toggleChange = new EventEmitter<{ item: any; field: string; value: boolean }>();

  @ViewChild('filter') filter!: ElementRef;
  
  displayConfirmation: boolean = false;
  selectedItemId: any = null;

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    if (this.filter) {
      this.filter.nativeElement.value = '';
    }
  }

  openConfirmation(item: any) {
    this.selectedItemId = item.id;
    this.displayConfirmation = true;
  }

  closeConfirmation(confirmed: boolean) {
    this.displayConfirmation = false;
    if (confirmed && this.selectedItemId !== null) {
      this.delete.emit(this.selectedItemId);
    }
  }

  resolveField(obj: any, path: string) {
    if (!path || !obj) return '';
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  onToggle(item: any, field: string, value: boolean) {
    this.toggleChange.emit({ item, field, value });
  }
}
