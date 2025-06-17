import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor/auth.interceptor';
import { MessageService } from 'primeng/api';

import { CadencePreset } from '../themes/cadence-preset';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authInterceptor])),
		provideAnimationsAsync(),
		providePrimeNG({
			theme: {
				preset: CadencePreset,
			},
		}),
		MessageService,
	],
};
