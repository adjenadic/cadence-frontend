import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ErrorHandlingService {
	extractErrorMessage(error: any): string {
		if (error.error?.message) {
			return error.error.message;
		}
		if (typeof error.error === 'string') {
			return error.error;
		}
		if (error.message) {
			return error.message;
		}
		return 'An unexpected error occurred';
	}

	getErrorSeverity(status: number): string {
		return status >= 500 ? 'error' : 'warn';
	}
}
