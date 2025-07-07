export interface ReviewDto {
	id: string;
	albumId: string;
	userId: number;
	username: string;
	userProfilePicture: string;
	content: string;
	rating: number;
	timestamp: number;
	edited: boolean;
}
