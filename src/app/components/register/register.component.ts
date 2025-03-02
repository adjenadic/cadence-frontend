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
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputTextModule,
		ButtonModule,
		ToastModule,
		RouterModule,
	],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
	registerForm: FormGroup;
	loading = false;

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router,
		private messageService: MessageService,
	) {
		this.registerForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			username: ['', Validators.required],
			password: ['', Validators.required],
		});
	}

	onSubmit() {
		if (this.registerForm.invalid) {
			return;
		}

		this.loading = true;
		const { email, username, password } = this.registerForm.value;

		this.userService
			.postCreateUser({ email, username, password })
			.subscribe({
				next: response => {
					this.messageService.add({
						severity: 'success',
						summary: 'Registration Successful',
						detail: 'You can now log in',
					});
					this.router.navigate(['/login']);
				},
				error: error => {
					this.messageService.add({
						severity: 'error',
						summary: 'Registration Failed',
						detail:
							error.message ||
							'An error occurred during registration',
					});
					this.loading = false;
				},
			});
	}
}
