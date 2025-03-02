import { Component } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/user-service/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputTextModule,
		ButtonModule,
		CheckboxModule,
		ToastModule,
		RouterModule,
	],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	loginForm: FormGroup;
	loading = false;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private messageService: MessageService,
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
		});
	}

	onSubmit() {
		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		const { email, password } = this.loginForm.value;

		this.authService.login({ email, password }).subscribe({
			next: () => {
				this.router.navigate(['/']);
			},
			error: error => {
				this.messageService.add({
					severity: 'error',
					summary: 'Login Failed',
					detail: 'Invalid email or password',
				});
				this.loading = false;
			},
		});
	}
}
