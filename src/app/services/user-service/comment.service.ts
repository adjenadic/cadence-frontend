import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { ApiEndpoints } from '../api.endpoints';
import { ResponseCommentDto } from '../../dtos/response-comment-dto';
import { RequestCreateCommentDto } from '../../dtos/request-create-comment-dto';
import { RequestUpdateCommentDto } from '../../dtos/request-update-comment-dto';

@Injectable({
	providedIn: 'root',
})
export class CommentService {
	constructor(private httpClient: HttpClient) {}

	getFindCommentsByUserId(userId: number) {
		return this.httpClient.get<ResponseCommentDto[]>(
			environment.userServiceApiUrl +
				ApiEndpoints.comments.getByUserId +
				'/' +
				userId,
		);
	}

	getFindCommentById(id: number) {
		return this.httpClient.get<ResponseCommentDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.comments.getById +
				'/' +
				id,
		);
	}

	postCreateComment(comment: RequestCreateCommentDto) {
		return this.httpClient.post<ResponseCommentDto>(
			environment.userServiceApiUrl + ApiEndpoints.comments.postCreate,
			comment,
		);
	}

	putUpdateComment(request: RequestUpdateCommentDto) {
		return this.httpClient.put<ResponseCommentDto>(
			environment.userServiceApiUrl + ApiEndpoints.comments.putUpdate,
			request,
		);
	}

	putLikeComment(id: number) {
		return this.httpClient.put<ResponseCommentDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.comments.putLike +
				'/' +
				id,
			{},
		);
	}

	putUnlikeComment(id: number) {
		return this.httpClient.put<ResponseCommentDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.comments.putUnlike +
				'/' +
				id,
			{},
		);
	}

	deleteCommentById(id: number) {
		return this.httpClient.delete<boolean>(
			environment.userServiceApiUrl +
				ApiEndpoints.comments.deleteById +
				'/' +
				id,
		);
	}
}
