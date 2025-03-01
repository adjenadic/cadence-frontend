import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { ApiEndpoints } from '../api.endpoints';
import { TokenDto } from '../../dtos/token-dto';
import { RequestLoginDto } from '../../dtos/request-login-dto';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private httpClient: HttpClient) {}

	postLogin(request: RequestLoginDto) {
		return this.httpClient.post<TokenDto>(
			environment.userServiceApiUrl + ApiEndpoints.auth.postLogin,
			request,
		);
	}
}
