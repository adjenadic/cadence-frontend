export interface ResponseCommentDto {
	id: number;
	content: string;
	timestamp: number;
	userId: number;
	commenterId: number;
	likes: number;
	edited: boolean;
}
