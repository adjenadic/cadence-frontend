import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { ApiEndpoints } from '../api.endpoints';
import { TokenDto } from '../../dtos/token-dto';
import { RequestLoginDto } from '../../dtos/request-login-dto';
import { jwtDecode } from 'jwt-decode';
import { ResponseUserDto } from '../../dtos/response-user-dto';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly JWT_TOKEN = 'JWT_TOKEN';
	private currentUserSubject = new BehaviorSubject<ResponseUserDto | null>(
		null,
	);
	private isAuthenticatedSubject = new BehaviorSubject<boolean>(
		!!localStorage.getItem(this.JWT_TOKEN),
	);

	constructor(
		private httpClient: HttpClient,
		private userService: UserService,
		private router: Router,
	) {}

	login(request: RequestLoginDto) {
		return this.httpClient
			.post<TokenDto>(
				environment.userServiceApiUrl + ApiEndpoints.auth.postLogin,
				request,
			)
			.pipe(
				tap((response: TokenDto) => {
					localStorage.setItem(this.JWT_TOKEN, response.token);
					this.isAuthenticatedSubject.next(true);
				}),
			);
	}

	logout(): void {
		localStorage.removeItem(this.JWT_TOKEN);
		this.currentUserSubject.next(null);
		this.isAuthenticatedSubject.next(false);
		this.router.navigate(['/login']);
	}

	isAuthenticated(): Observable<boolean> {
		return this.isAuthenticatedSubject.asObservable();
	}

	isTokenExpired(): boolean {
		const decoded = this.getDecodedToken();
		return !decoded?.exp || decoded.exp * 1000 < Date.now();
	}

	getCurrentUser(): Observable<ResponseUserDto | null> {
		const username = this.getUsername();
		if (!username) {
			this.currentUserSubject.next(null);
			return this.currentUserSubject.asObservable();
		}
		if (!this.currentUserSubject.value) {
			this.loadCurrentUser(username);
		}
		return this.currentUserSubject.asObservable();
	}

	refreshCurrentUser(): void {
		const username = this.getUsername();
		if (username) this.loadCurrentUser(username);
	}

	private getDecodedToken(): any {
		const token = localStorage.getItem(this.JWT_TOKEN);
		if (!token) return null;
		try {
			return jwtDecode(token);
		} catch {
			return null;
		}
	}

	private getUsername(): string | null {
		return this.getDecodedToken()?.sub || null;
	}

	private loadCurrentUser(username: string): void {
		this.userService.getFindUserByEmail(username).subscribe({
			next: user => this.currentUserSubject.next(user),
			error: () => this.currentUserSubject.next(null),
		});
	}
}
