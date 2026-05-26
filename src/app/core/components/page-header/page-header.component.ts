import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex items-center gap-4 mb-4">
      <p-button icon="pi pi-arrow-left" [rounded]="true" [text]="true" severity="secondary" (onClick)="goBack()"></p-button>
      <div>
        <h2 class="text-2xl font-semibold m-0">{{ title }}</h2>
        <p *ngIf="subtitle" class="text-gray-500 text-sm mt-1 mb-0">{{ subtitle }}</p>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
