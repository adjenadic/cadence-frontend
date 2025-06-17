import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { TextareaModule } from 'primeng/textarea';

import { UserService } from '../../../services/user-service/user.service';
import { AuthService } from '../../../services/user-service/auth.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlingService } from '../../../services/error-handling-service/error-handling.service';
import { ResponseUserDto } from '../../../dtos/response-user-dto';
import { RequestUpdateEmailDto } from '../../../dtos/request-update-email-dto';
import { RequestUpdateUsernameDto } from '../../../dtos/request-update-username-dto';
import { RequestUpdatePasswordDto } from '../../../dtos/request-update-password-dto';
import { RequestUpdatePronounsDto } from '../../../dtos/request-update-pronouns-dto';
import { RequestUpdateAboutMeDto } from '../../../dtos/request-update-about-me-dto';
import { usernameValidator } from '../../../validators/username.validator';
import { passwordValidator } from '../../../validators/password.validator';
import { passwordMatchValidator } from '../../../validators/password-match.validator';

@Component({
	selector: 'app-config',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		CardModule,
		ButtonModule,
		InputTextModule,
		TextareaModule,
		PasswordModule,
		DividerModule,
		ToastModule,
	],
	templateUrl: './config.component.html',
	styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit, OnDestroy {
	currentUser: ResponseUserDto | null = null;

	emailForm: FormGroup;
	usernameForm: FormGroup;
	passwordForm: FormGroup;
	pronounsForm: FormGroup;
	aboutMeForm: FormGroup;

	savingStates = {
		email: false,
		username: false,
		password: false,
		pronouns: false,
		aboutMe: false,
	};

	private destroy$ = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private userService: UserService,
		private authService: AuthService,
		private messageService: MessageService,
		private errorHandlingService: ErrorHandlingService,
	) {
		this.emailForm = this.fb.group({
			currentEmail: ['', [Validators.required, Validators.email]],
			updatedEmail: ['', [Validators.required, Validators.email]],
		});

		this.usernameForm = this.fb.group({
			email: [''],
			username: ['', usernameValidator()],
		});

		this.passwordForm = this.fb.group(
			{
				email: [''],
				currentPassword: [''],
				updatedPassword: ['', passwordValidator()],
				updatedPasswordConfirmation: [''],
			},
			{
				validators: passwordMatchValidator(
					'updatedPassword',
					'updatedPasswordConfirmation',
				),
			},
		);

		this.pronounsForm = this.fb.group({
			email: [''],
			pronouns: ['', [Validators.maxLength(50)]],
		});

		this.aboutMeForm = this.fb.group({
			email: [''],
			aboutMe: ['', [Validators.maxLength(512)]],
		});
	}

	ngOnInit() {
		this.loadCurrentUser();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private loadCurrentUser() {
		this.authService
			.getCurrentUser()
			.pipe(takeUntil(this.destroy$))
			.subscribe(user => {
				this.currentUser = user;
				if (user) {
					this.populateForms(user);
				}
			});
	}

	private populateForms(user: ResponseUserDto) {
		this.emailForm.patchValue({
			currentEmail: user.email,
		});

		this.usernameForm.patchValue({
			email: user.email,
			username: user.username,
		});

		this.passwordForm.patchValue({
			email: user.email,
		});

		this.pronounsForm.patchValue({
			email: user.email,
			pronouns: user.pronouns || '',
		});

		this.aboutMeForm.patchValue({
			email: user.email,
			aboutMe: user.aboutMe || '',
		});
	}

	navigateBack() {
		if (this.currentUser) {
			this.router.navigate(['/profile', this.currentUser.username]);
		}
	}

	saveEmail() {
		if (this.emailForm.valid) {
			this.savingStates.email = true;
			const request: RequestUpdateEmailDto = this.emailForm.value;

			this.userService
				.putUpdateEmail(request)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: () => {
						this.savingStates.email = false;
						this.messageService.add({
							severity: 'info',
							summary: 'Email Updated',
							detail: "Verification email sent. You'll be logged out and must verify your new email before logging in again.",
						});

						setTimeout(() => {
							this.authService.logout();
							this.router.navigate(['/login']);
						}, 500);
					},
					error: error => {
						this.savingStates.email = false;
						const errorMessage =
							this.errorHandlingService.extractErrorMessage(
								error,
							);
						this.messageService.add({
							severity: 'error',
							summary: 'Email update failed',
							detail: errorMessage,
						});
					},
				});
		}
	}

	saveUsername() {
		if (this.usernameForm.valid) {
			this.savingStates.username = true;
			const request: RequestUpdateUsernameDto = this.usernameForm.value;

			this.userService
				.putUpdateUsername(request)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: () => {
						this.savingStates.username = false;
						this.usernameForm.markAsUntouched();
						this.usernameForm.markAsPristine();
						this.authService.refreshCurrentUser();
						this.messageService.add({
							severity: 'success',
							summary: 'Username updated successfully',
						});
					},
					error: error => {
						this.savingStates.username = false;
						const errorMessage =
							this.errorHandlingService.extractErrorMessage(
								error,
							);
						this.messageService.add({
							severity: 'error',
							summary: 'Username update failed',
							detail: errorMessage,
						});
					},
				});
		}
	}

	savePassword() {
		if (this.passwordForm.valid) {
			this.savingStates.password = true;
			const request: RequestUpdatePasswordDto = this.passwordForm.value;

			this.userService
				.putUpdatePassword(request)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: () => {
						this.savingStates.password = false;
						this.messageService.add({
							severity: 'info',
							summary: 'Password Updated',
							detail: "You'll be logged out for security. Please sign in with your new password.",
						});

						setTimeout(() => {
							this.authService.logout();
							this.router.navigate(['/login']);
						}, 500);
					},
					error: error => {
						this.savingStates.password = false;
						const errorMessage =
							this.errorHandlingService.extractErrorMessage(
								error,
							);
						this.messageService.add({
							severity: 'error',
							summary: 'Password update failed',
							detail: errorMessage,
						});
					},
				});
		}
	}

	savePronouns() {
		if (this.pronounsForm.valid) {
			this.savingStates.pronouns = true;
			const request: RequestUpdatePronounsDto = this.pronounsForm.value;

			this.userService
				.putUpdatePronouns(request)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: () => {
						this.savingStates.pronouns = false;
						this.pronounsForm.markAsUntouched();
						this.pronounsForm.markAsPristine();
						this.authService.refreshCurrentUser();
						this.messageService.add({
							severity: 'success',
							summary: 'Pronouns updated successfully',
						});
					},
					error: error => {
						this.savingStates.pronouns = false;
						const errorMessage =
							this.errorHandlingService.extractErrorMessage(
								error,
							);
						this.messageService.add({
							severity: 'error',
							summary: 'Pronouns update failed',
							detail: errorMessage,
						});
					},
				});
		}
	}

	saveAboutMe() {
		if (this.aboutMeForm.valid) {
			this.savingStates.aboutMe = true;
			const request: RequestUpdateAboutMeDto = this.aboutMeForm.value;

			this.userService
				.putUpdateAboutMe(request)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: () => {
						this.savingStates.aboutMe = false;
						this.aboutMeForm.markAsUntouched();
						this.aboutMeForm.markAsPristine();
						this.authService.refreshCurrentUser();
						this.messageService.add({
							severity: 'success',
							summary: 'About me updated successfully',
						});
					},
					error: error => {
						this.savingStates.aboutMe = false;
						const errorMessage =
							this.errorHandlingService.extractErrorMessage(
								error,
							);
						this.messageService.add({
							severity: 'error',
							summary: 'About me update failed',
							detail: errorMessage,
						});
					},
				});
		}
	}

	get isUsernameUnchanged(): boolean {
		const currentUsername = this.usernameForm.get('username')?.value;
		return currentUsername === this.currentUser?.username;
	}

	get isPronounsUnchanged(): boolean {
		const currentPronouns = this.pronounsForm.get('pronouns')?.value;
		return currentPronouns === (this.currentUser?.pronouns || '');
	}

	get isAboutMeUnchanged(): boolean {
		const currentAboutMe = this.aboutMeForm.get('aboutMe')?.value;
		return currentAboutMe === (this.currentUser?.aboutMe || '');
	}

	get aboutMeCharacterCount(): number {
		return this.aboutMeForm.get('aboutMe')?.value?.length || 0;
	}
}
