import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
	{
		component: LandingComponent,
		path: '',
	},
	{
		component: ProfileComponent,
		path: 'profile',
	},
	{
		component: LoginComponent,
		path: 'login',
	},
	{
		component: RegisterComponent,
		path: 'register',
	},
];
