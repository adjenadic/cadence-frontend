import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { ApiEndpoints } from '../api.endpoints';
import { TokenDto } from '../../dtos/token-dto';
import { RequestLoginDto } from '../../dtos/request-login-dto';
import { jwtDecode } from 'jwt-decode';
import { ResponseUserDto } from '../../dtos/response-user-dto';
import { of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private httpClient: HttpClient,
		private userService: UserService,
	) {}

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

	private decodeToken(): any {
		const token = localStorage.getItem(this.JWT_TOKEN);
		if (!token) return null;
		try {
			return jwtDecode(token);
		} catch (error) {
			return null;
		}
	}

	getUsername(): string | null {
		const decoded = this.decodeToken();
		return decoded?.sub || null;
	}

	getCurrentUser(): Observable<ResponseUserDto | null> {
		const username = this.getUsername();
		if (!username) return of(null);
		return this.userService.getFindUserByEmail(username);
	}
}
