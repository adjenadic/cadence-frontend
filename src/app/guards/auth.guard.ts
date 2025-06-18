import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/user-service/auth.service';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = route => {
	const router = inject(Router);
	const authService = inject(AuthService);

	if (authService.isTokenExpired()) {
		router.navigate(['/login']);
		return false;
	}

	const usernameFromRoute = route.paramMap.get('username');
	if (usernameFromRoute) {
		return authService.getCurrentUser().pipe(
			filter(currentUser => currentUser !== null),
			take(1),
			map(currentUser => {
				const isOwnProfile =
					currentUser!.username === usernameFromRoute;
				const hasManagePermissions =
					currentUser!.permissions?.includes('MANAGE_PERMISSIONS');

				if (isOwnProfile || hasManagePermissions) {
					return true;
				}

				router.navigate(['/']);
				return false;
			}),
		);
	}

	return true;
};
