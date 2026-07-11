import { ReviewsService } from '../../../../core/services/reviews.service';
import { Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TableDataComponent, TableColumn, TableAction } from '../../../../core/components/table-data/table-data.component';
import { rxResource } from '@angular/core/rxjs-interop';

export interface Review {
    id: number;
    type: string;
    product_id: number;
    rating: string;
    comment: string;
    image: string[];
    video: string[];
    user_name: string;
    user_email: string;
    user_job_title: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

@Component({
    selector: 'app-reviews',
    imports: [CommonModule, ButtonModule, DialogModule, TagModule, TableDataComponent],
    templateUrl: './reviews.component.html',
    styleUrl: './reviews.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ReviewsComponent {
    private reviews = inject(ReviewsService);

    reviewsResource = rxResource({
        stream: () => this.reviews.getReviews()
    });

    reviewsList = computed(() => this.reviewsResource.value()?.reviews ?? []);
    loading = computed(() => this.reviewsResource.isLoading());

    selectedReview = signal<Review | null>(null);
    displayDetails: boolean = false;

    tableColumns: TableColumn[] = [
        { field: 'id', header: 'ID', type: 'text' },
        { field: 'type', header: 'Type', type: 'text', isTitleCase: true },
        { field: 'product_id', header: 'Product ID', type: 'text' },
        { field: 'user_name', header: 'User Name', type: 'text' },
        { field: 'rating', header: 'Rating', type: 'text' },
        { field: 'status', header: 'Active', type: 'toggle' },
        { field: 'created_at', header: 'Created At', type: 'date' }
    ];
    globalFilterFields: string[] = ['id', 'type', 'user_name', 'user_email', 'rating'];

    customActions: TableAction[] = [{ icon: 'pi pi-eye', severity: 'info', onClick: (item) => this.viewDetails(item) }];

    viewDetails(item: Review) {
        this.selectedReview.set(item);
        this.displayDetails = true;
    }

    onStatusToggle(event: { item: Review; field: string; value: boolean }) {
        this.reviews.UpdateReviewStatus(String(event.item.id), event.value).subscribe(() => {
            this.reviewsResource.reload();
        });
    }
}
