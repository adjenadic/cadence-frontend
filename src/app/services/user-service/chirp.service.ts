import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { ApiEndpoints } from '../api.endpoints';
import { ResponseChirpDto } from '../../dtos/response-chirp-dto';
import { RequestCreateChirpDto } from '../../dtos/request-create-chirp-dto';
import { RequestUpdateChirpDto } from '../../dtos/request-update-chirp-dto';

@Injectable({
	providedIn: 'root',
})
export class ChirpService {
	constructor(private httpClient: HttpClient) {}

	getFindChirpsByUserId(userId: number) {
		return this.httpClient.get<ResponseChirpDto[]>(
			environment.userServiceApiUrl +
				ApiEndpoints.chirps.getByUserId +
				'/' +
				userId,
		);
	}

	getFindChirpsById(id: number) {
		return this.httpClient.get<ResponseChirpDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.chirps.getById +
				'/' +
				id,
		);
	}

	postCreateChirps(chirp: RequestCreateChirpDto) {
		return this.httpClient.post<ResponseChirpDto>(
			environment.userServiceApiUrl + ApiEndpoints.chirps.postCreate,
			chirp,
		);
	}

	putUpdateChirp(request: RequestUpdateChirpDto) {
		return this.httpClient.put<ResponseChirpDto>(
			environment.userServiceApiUrl + ApiEndpoints.chirps.putUpdate,
			request,
		);
	}

	putLikeChirp(id: number) {
		return this.httpClient.put<ResponseChirpDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.chirps.putLike +
				'/' +
				id,
			{},
		);
	}

	putUnlikeChirp(id: number) {
		return this.httpClient.put<ResponseChirpDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.chirps.putUnlike +
				'/' +
				id,
			{},
		);
	}

	deleteChirpById(id: number) {
		return this.httpClient.delete<boolean>(
			environment.userServiceApiUrl +
				ApiEndpoints.chirps.deleteById +
				'/' +
				id,
		);
	}
}
