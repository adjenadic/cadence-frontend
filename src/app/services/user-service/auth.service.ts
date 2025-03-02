import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

	private readonly JWT_TOKEN = 'JWT_TOKEN';
	private isAuthenticatedSubject = new BehaviorSubject<boolean>(
		this.hasToken(),
	);

	login(request: RequestLoginDto) {
		return this.postLogin(request).pipe(
			tap((response: TokenDto) => {
				this.storeToken(response.token);
				this.isAuthenticatedSubject.next(true);
			}),
		);
	}

	logout(): void {
		localStorage.removeItem(this.JWT_TOKEN);
		this.isAuthenticatedSubject.next(false);
	}

	isAuthenticated(): Observable<boolean> {
		return this.isAuthenticatedSubject.asObservable();
	}

	private storeToken(token: string): void {
		localStorage.setItem(this.JWT_TOKEN, token);
	}

	private hasToken(): boolean {
		return !!localStorage.getItem(this.JWT_TOKEN);
	}
}
