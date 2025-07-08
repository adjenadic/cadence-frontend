import {
	Component,
	Input,
	Output,
	OnInit,
	OnDestroy,
	OnChanges,
	SimpleChanges,
	EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';

import { ReviewService } from '../../services/review-service/review.service';
import { AuthService } from '../../services/user-service/auth.service';
import { MessageService } from 'primeng/api';
import { ReviewDto } from '../../dtos/review-dto';
import { CreateReviewDto } from '../../dtos/create-review-dto';
import { ResponseUserDto } from '../../dtos/response-user-dto';
import { AlbumSummaryDto } from '../../dtos/album-summary-dto';
import { Router } from '@angular/router';

@Component({
	selector: 'app-catalog-reviews',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		CardModule,
		ButtonModule,
		TextareaModule,
		RatingModule,
		ToastModule,
	],
	templateUrl: './catalog-reviews.component.html',
	styleUrl: './catalog-reviews.component.css',
})
export class CatalogReviewsComponent implements OnInit, OnDestroy, OnChanges {
	@Input() album: AlbumSummaryDto | null = null;
	@Output() reviewSubmitted = new EventEmitter<void>();

	reviews: ReviewDto[] = [];
	currentUser: ResponseUserDto | null = null;
	isAuthenticated = false;
	newReviewContent = '';
	newReviewRating = 0;
	isSubmitting = false;
	isLoading = true;
	editingReviewId: string | null = null;
	editContent = '';
	editRating = 0;
	hasExistingReview = false;

	private destroy$ = new Subject<void>();

	constructor(
		private router: Router,
		private reviewService: ReviewService,
		private authService: AuthService,
		private messageService: MessageService,
	) {}

	ngOnInit() {
		if (this.album) {
			this.loadReviews();
		}

		this.authService
			.isAuthenticated()
			.pipe(takeUntil(this.destroy$))
			.subscribe(isAuth => {
				this.isAuthenticated = isAuth;
				if (isAuth) {
					this.loadCurrentUser();
				}
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['album'] && this.album) {
			this.resetComponentState();
			this.loadReviews();
		}
	}

	private resetComponentState() {
		this.reviews = [];
		this.newReviewContent = '';
		this.newReviewRating = 0;
		this.hasExistingReview = false;
		this.editingReviewId = null;
		this.editContent = '';
		this.editRating = 0;
		this.isSubmitting = false;
		this.isLoading = true;
	}

	loadCurrentUser() {
		this.authService
			.getCurrentUser()
			.pipe(takeUntil(this.destroy$))
			.subscribe(user => {
				this.currentUser = user;
			});
	}

	loadReviews() {
		if (!this.album) return;

		this.isLoading = true;
		this.reviewService
			.getAlbumReviews(this.album.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: reviews => {
					this.reviews = this.sortReviews(reviews);
					this.checkForExistingReview();
					this.isLoading = false;
				},
				error: () => {
					this.isLoading = false;
				},
			});
	}

	private sortReviews(reviews: ReviewDto[]): ReviewDto[] {
		if (!this.currentUser) return reviews;

		const userReview = reviews.find(r => r.userId === this.currentUser!.id);
		const otherReviews = reviews.filter(
			r => r.userId !== this.currentUser!.id,
		);

		return userReview ? [userReview, ...otherReviews] : reviews;
	}

	private checkForExistingReview() {
		if (!this.currentUser) return;
		this.hasExistingReview = this.reviews.some(
			r => r.userId === this.currentUser!.id,
		);
	}

	submitReview() {
		if (
			!this.newReviewContent.trim() ||
			!this.newReviewRating ||
			!this.currentUser ||
			!this.album ||
			this.isSubmitting
		) {
			return;
		}

		this.isSubmitting = true;

		const reviewRequest: CreateReviewDto = {
			albumId: this.album.id,
			userId: this.currentUser.id,
			content: this.newReviewContent.trim(),
			rating: this.newReviewRating,
		};

		this.reviewService
			.createReview(reviewRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.newReviewContent = '';
					this.newReviewRating = 0;
					this.isSubmitting = false;
					this.loadReviews();
					this.reviewSubmitted.emit();
					this.messageService.add({
						severity: 'success',
						summary: 'Review posted!',
					});
				},
				error: () => {
					this.isSubmitting = false;
					this.messageService.add({
						severity: 'error',
						summary: 'Failed to post review',
					});
				},
			});
	}

	startEdit(review: ReviewDto) {
		this.editingReviewId = review.id;
		this.editContent = review.content;
		this.editRating = review.rating;
	}

	cancelEdit() {
		this.editingReviewId = null;
		this.editContent = '';
		this.editRating = 0;
	}

	updateReview() {
		if (
			!this.editContent.trim() ||
			!this.editRating ||
			!this.currentUser ||
			!this.album ||
			this.isSubmitting
		) {
			return;
		}

		this.isSubmitting = true;

		const reviewRequest: CreateReviewDto = {
			albumId: this.album.id,
			userId: this.currentUser.id,
			content: this.editContent.trim(),
			rating: this.editRating,
		};

		this.reviewService
			.createReview(reviewRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.isSubmitting = false;
					this.cancelEdit();
					this.loadReviews();
					this.reviewSubmitted.emit();
					this.messageService.add({
						severity: 'success',
						summary: 'Review updated!',
					});
				},
				error: () => {
					this.isSubmitting = false;
					this.messageService.add({
						severity: 'error',
						summary: 'Failed to update review',
					});
				},
			});
	}

	canEditReview(review: ReviewDto): boolean {
		return this.currentUser?.id === review.userId;
	}

	isReviewBeingEdited(reviewId: string): boolean {
		return this.editingReviewId === reviewId;
	}

	deleteReview(reviewId: string) {
		if (!this.currentUser) return;

		this.reviewService
			.deleteReview(reviewId, this.currentUser.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.loadReviews();
					this.messageService.add({
						severity: 'success',
						summary: 'Review deleted',
					});
				},
				error: () => {
					this.messageService.add({
						severity: 'error',
						summary: 'Failed to delete review',
					});
				},
			});
	}

	canDeleteReview(review: ReviewDto): boolean {
		return this.currentUser?.id === review.userId;
	}

	getReviewerProfilePictureUrl(review: ReviewDto): string {
		if (!review.userProfilePicture) {
			return 'assets/default-avatar.png';
		}
		return `data:image/jpeg;base64,${review.userProfilePicture}`;
	}

	formatTimestamp(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}

	getStarArray(rating: number): number[] {
		return Array(10)
			.fill(0)
			.map((_, i) => i);
	}

	shouldShowProfileLink(review: ReviewDto): boolean {
		return !!review.username;
	}

	navigateToReviewerProfile(review: ReviewDto) {
		if (review.username && this.shouldShowProfileLink(review)) {
			this.router.navigate(['/profile', review.username]);
		}
	}
}
