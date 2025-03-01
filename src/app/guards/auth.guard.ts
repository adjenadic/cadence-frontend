import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/user-service/auth.service';

export const authGuard: CanActivateFn = () => {
	const router = inject(Router);
	const authService = inject(AuthService);

	// if (authService.isTokenExpired()) {
	// 	router.navigate(['/login']);
	// 	return false;
	// }
	return true;
};
