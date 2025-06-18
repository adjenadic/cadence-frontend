import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ConfigComponent } from './components/profile/config/config.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		component: LandingComponent,
		path: '',
	},
	{
		component: LandingComponent,
		path: 'home',
	},
	{
		component: LoginComponent,
		path: 'login',
	},
	{
		component: RegisterComponent,
		path: 'register',
	},
	{
		component: VerifyEmailComponent,
		path: 'verify-email',
	},
	{
		component: ProfileComponent,
		path: 'profile/:username',
	},
	{
		component: ConfigComponent,
		path: 'profile/:username/config',
		canActivate: [authGuard],
	},
];
