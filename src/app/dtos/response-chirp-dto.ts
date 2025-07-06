export interface ResponseChirpDto {
	id: number;
	content: string;
	timestamp: number;
	userId: number;
	chirperId: number;
	chirperUsername: string;
	chirperProfilePicture: string;
	likes: number;
	edited: boolean;
}
