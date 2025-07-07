import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { ReviewDto } from '../../dtos/review-dto';
import { CreateReviewDto } from '../../dtos/create-review-dto';
import { ApiEndpoints } from '../api.endpoints';

@Injectable({
	providedIn: 'root',
})
export class ReviewService {
	constructor(private httpClient: HttpClient) {}

	getAlbumReviews(albumId: string) {
		return this.httpClient.get<ReviewDto[]>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getAlbumReviews(albumId),
		);
	}

	getUserReviews(userId: number) {
		return this.httpClient.get<ReviewDto[]>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getUserReviews(userId),
		);
	}

	createReview(review: CreateReviewDto) {
		return this.httpClient.post<ReviewDto>(
			environment.musicServiceApiUrl + ApiEndpoints.music.createReview,
			review,
		);
	}

	deleteReview(reviewId: string, userId: number) {
		return this.httpClient.delete<boolean>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.deleteReview(reviewId, userId),
		);
	}
}
