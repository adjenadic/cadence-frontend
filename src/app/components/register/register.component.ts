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
import { ErrorHandlingService } from '../../services/error-handling-service/error-handling.service';
import { UserService } from '../../services/user-service/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { usernameValidator } from '../../utils/validators/username.validator';
import { passwordValidator } from '../../utils/validators/password.validator';
import { passwordMatchValidator } from '../../utils/validators/password-match.validator';

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
		private errorHandlingService: ErrorHandlingService,
		private userService: UserService,
		private router: Router,
		private messageService: MessageService,
	) {
		this.registerForm = this.fb.group(
			{
				email: ['', [Validators.required, Validators.email]],
				username: ['', [Validators.required, usernameValidator()]],
				password: ['', [Validators.required, passwordValidator()]],
				confirmedPassword: ['', Validators.required],
			},
			{
				validators: passwordMatchValidator(
					'password',
					'confirmedPassword',
				),
			},
		);
	}

	onSubmit() {
		if (this.registerForm.invalid) {
			return;
		}

		this.loading = true;
		const { email, username, password, confirmedPassword } =
			this.registerForm.value;

		this.userService
			.postCreateUser({ email, username, password, confirmedPassword })
			.subscribe({
				next: response => {
					this.messageService.add({
						severity: 'success',
						summary:
							'Registration Successful (Pending Verification)',
						detail: 'The confirmation email has been sent to your specified email address.',
					});
					this.router.navigate(['/login']);
				},
				error: error => {
					this.loading = false;
					const errorMessage =
						this.errorHandlingService.extractErrorMessage(error);
					const severity = this.errorHandlingService.getErrorSeverity(
						error.status,
					);
					this.messageService.add({
						severity: severity,
						summary: 'Registration Failed',
						detail: errorMessage,
					});
				},
			});
	}
}
