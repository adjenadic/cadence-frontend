export interface CreateReviewDto {
	albumId: string;
	userId: number;
	content: string;
	rating: number;
}
