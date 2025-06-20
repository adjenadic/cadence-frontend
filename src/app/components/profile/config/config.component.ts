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
import { CheckboxModule } from 'primeng/checkbox';

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
import { usernameValidator } from '../../../utils/validators/username.validator';
import { passwordValidator } from '../../../utils/validators/password.validator';
import { passwordMatchValidator } from '../../../utils/validators/password-match.validator';
import { RequestUpdatePermissionsDto } from '../../../dtos/request-update-permissions-dto';
import { PERMISSIONS_LIST } from '../../../utils/constants/permissions';

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
		CheckboxModule,
	],
	templateUrl: './config.component.html',
	styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit, OnDestroy {
	user: ResponseUserDto | null = null;
	currentUser: ResponseUserDto | null = null;
	permissionsList = PERMISSIONS_LIST;

	usernameForm: FormGroup;
	pronounsForm: FormGroup;
	aboutMeForm: FormGroup;
	emailForm: FormGroup;
	passwordForm: FormGroup;
	permissionsForm: FormGroup;

	savingStates = {
		username: false,
		pronouns: false,
		aboutMe: false,
		email: false,
		password: false,
		permissions: false,
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
		this.usernameForm = this.fb.group({
			email: [''],
			username: ['', usernameValidator()],
		});

		this.pronounsForm = this.fb.group({
			email: [''],
			pronouns: ['', [Validators.maxLength(50)]],
		});

		this.aboutMeForm = this.fb.group({
			email: [''],
			aboutMe: ['', [Validators.maxLength(512)]],
		});

		this.emailForm = this.fb.group({
			currentEmail: ['', [Validators.required, Validators.email]],
			updatedEmail: ['', [Validators.required, Validators.email]],
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

		this.permissionsForm = this.fb.group({
			email: [''],
			permissions: [[]],
		});
	}

	ngOnInit() {
		this.authService
			.getCurrentUser()
			.pipe(takeUntil(this.destroy$))
			.subscribe(currentUser => {
				this.currentUser = currentUser;

				this.route.params
					.pipe(takeUntil(this.destroy$))
					.subscribe(params => {
						const username = params['username'];
						if (username) {
							if (
								currentUser &&
								currentUser.username === username
							) {
								this.user = currentUser;
								this.populateForms(currentUser);
								this.updateFormStates();
							} else {
								this.loadUserProfile(username);
							}
						}
					});
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private populateForms(user: ResponseUserDto) {
		this.usernameForm.patchValue({
			email: user.email,
			username: user.username,
		});

		this.pronounsForm.patchValue({
			email: user.email,
			pronouns: user.pronouns || '',
		});

		this.aboutMeForm.patchValue({
			email: user.email,
			aboutMe: user.aboutMe || '',
		});

		this.emailForm.patchValue({
			currentEmail: user.email,
		});

		this.passwordForm.patchValue({
			email: user.email,
		});

		this.permissionsForm.patchValue({
			email: user.email,
			permissions: user.permissions || [],
		});
	}

	private updateFormStates() {
		if (!this.canEditPassword) {
			this.passwordForm.disable();
		}

		if (!this.canEditEmail) {
			this.emailForm.get('updatedEmail')?.disable();
		}

		if (!this.canEditAboutMe) {
			this.aboutMeForm.disable();
		}

		if (!this.canEditPronouns) {
			this.pronounsForm.disable();
		}
	}

	private loadUserProfile(username: string) {
		this.userService
			.getFindUserByUsername(username)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: user => {
					this.user = user;
					this.populateForms(user);
					this.updateFormStates();
				},
				error: () => {
					this.user = null;
				},
			});
	}

	navigateBack() {
		if (this.user) {
			this.router.navigate(['/profile', this.user.username]);
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

						const newUsername =
							this.usernameForm.get('username')?.value;
						if (newUsername) {
							this.router.navigate([
								'/profile',
								newUsername,
								'config',
							]);
						}

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

	savePermissions() {
		if (this.permissionsForm.valid) {
			this.savingStates.permissions = true;
			const request: RequestUpdatePermissionsDto =
				this.permissionsForm.value;

			this.userService
				.putUpdatePermissions(request)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: () => {
						this.savingStates.permissions = false;
						this.permissionsForm.markAsUntouched();
						this.permissionsForm.markAsPristine();
						this.authService.refreshCurrentUser();
						this.messageService.add({
							severity: 'success',
							summary: 'Permissions updated successfully',
							detail: 'User will need to log in again to see changes.',
						});
					},
					error: error => {
						this.savingStates.permissions = false;
						const errorMessage =
							this.errorHandlingService.extractErrorMessage(
								error,
							);
						this.messageService.add({
							severity: 'error',
							summary: 'Permissions update failed',
							detail: errorMessage,
						});
					},
				});
		}
	}

	deleteUser() {
		if (!this.user?.email) return;

		this.userService
			.deleteUserByEmail(this.user.email)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.messageService.add({
						severity: 'success',
						summary: 'Account deleted successfully',
					});

					if (this.currentUser?.username === this.user?.username) {
						this.authService.logout();
					}

					setTimeout(() => {
						this.router.navigate(['/']);
					}, 1000);
				},
				error: error => {
					const errorMessage =
						this.errorHandlingService.extractErrorMessage(error);
					this.messageService.add({
						severity: 'error',
						summary: 'Account deletion failed',
						detail: errorMessage,
					});
				},
			});
	}

	get isUsernameUnchanged(): boolean {
		const currentUsername = this.usernameForm.get('username')?.value;
		return currentUsername === this.user?.username;
	}

	get isPronounsUnchanged(): boolean {
		const currentPronouns = this.pronounsForm.get('pronouns')?.value;
		return currentPronouns === (this.user?.pronouns || '');
	}

	get isAboutMeUnchanged(): boolean {
		const currentAboutMe = this.aboutMeForm.get('aboutMe')?.value;
		return currentAboutMe === (this.user?.aboutMe || '');
	}

	get isPermissionsUnchanged(): boolean {
		const currentPermissions =
			this.permissionsForm.get('permissions')?.value;
		const originalPermissions = this.user?.permissions || [];
		return (
			JSON.stringify(currentPermissions?.sort()) ===
			JSON.stringify(originalPermissions?.sort())
		);
	}

	get aboutMeCharacterCount(): number {
		return this.aboutMeForm.get('aboutMe')?.value?.length || 0;
	}

	get canEditUsername(): boolean {
		return !!(
			this.currentUser?.permissions?.includes('MANAGE_USERNAMES') ||
			this.currentUser?.permissions?.includes('MANAGE_PERMISSIONS')
		);
	}

	get canEditPronouns(): boolean {
		return (
			this.currentUser?.username === this.user?.username ||
			!!this.currentUser?.permissions?.includes('MANAGE_USER_DETAILS')
		);
	}

	get canEditAboutMe(): boolean {
		return (
			this.currentUser?.username === this.user?.username ||
			!!this.currentUser?.permissions?.includes('MANAGE_USER_DETAILS')
		);
	}

	get canEditEmail(): boolean {
		return this.currentUser?.username === this.user?.username;
	}

	get canEditPassword(): boolean {
		return this.currentUser?.username === this.user?.username;
	}

	get canEditPermissions(): boolean {
		return !!this.currentUser?.permissions?.includes('MANAGE_PERMISSIONS');
	}

	get canDeleteUser(): boolean {
		return (
			this.currentUser?.username === this.user?.username ||
			!!this.currentUser?.permissions?.includes('DELETE_USERS')
		);
	}

	formatPermissionLabel(permission: string): string {
		return permission
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b\w/g, l => l.toUpperCase());
	}
}
