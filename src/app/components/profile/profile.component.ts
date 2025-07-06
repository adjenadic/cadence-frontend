import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { UserService } from '../../services/user-service/user.service';
import { AuthService } from '../../services/user-service/auth.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlingService } from '../../services/error-handling-service/error-handling.service';
import { ResponseUserDto } from '../../dtos/response-user-dto';
import { RequestUpdateProfilePictureDto } from '../../dtos/request-update-profile-picture-dto';
import { ChirpsComponent } from '../chirps/chirps.component';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [
		CommonModule,
		CardModule,
		ButtonModule,
		InputTextModule,
		AvatarModule,
		ChipModule,
		DividerModule,
		SkeletonModule,
		ToastModule,
		TooltipModule,
		ChirpsComponent,
	],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
	user: ResponseUserDto | null = null;
	currentUser: ResponseUserDto | null = null;
	isOwnProfile = false;
	isLoading = true;

	private destroy$ = new Subject<void>();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userService: UserService,
		private authService: AuthService,
		private messageService: MessageService,
		private errorHandlingService: ErrorHandlingService,
	) {}

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
								this.isOwnProfile = true;
								this.isLoading = false;
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

	loadUserProfile(username: string) {
		this.isLoading = true;
		this.userService
			.getFindUserByUsername(username)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: user => {
					this.user = user;
					this.isLoading = false;
					this.checkIfOwnProfile();
				},
				error: () => {
					this.isLoading = false;
					this.user = null;
				},
			});
	}

	checkIfOwnProfile() {
		this.isOwnProfile = !!(
			this.user &&
			this.currentUser &&
			this.user.username === this.currentUser.username
		);
	}

	getProfilePictureUrl(): string {
		if (!this.user?.profilePicture) {
			return 'assets/default-avatar.png';
		}
		return `data:image/jpeg;base64,${this.user.profilePicture}`;
	}

	navigateToEditProfile() {
		if (this.canEditProfile() && this.user) {
			this.router.navigate(['/profile', this.user.username, 'config']);
		}
	}

	onFileSelected(event: any) {
		if (!this.isOwnProfile || !this.user || !event.target.files?.length)
			return;

		const file = event.target.files[0];

		if (file.size > 5 * 1024 * 1024) {
			this.messageService.add({
				severity: 'error',
				summary: 'File too large',
				detail: 'Please select an image smaller than 5MB',
			});
			return;
		}

		if (!file.type.startsWith('image/')) {
			this.messageService.add({
				severity: 'error',
				summary: 'Invalid file type',
				detail: 'Please select an image file',
			});
			return;
		}

		const reader = new FileReader();

		reader.onload = e => {
			const result = e.target?.result as string;
			if (!result || !result.includes(',')) {
				this.messageService.add({
					severity: 'error',
					summary: 'Failed to process image',
					detail: 'Could not read the selected file',
				});
				return;
			}

			const base64String = result.split(',')[1];
			const request: RequestUpdateProfilePictureDto = {
				email: this.user!.email,
				profilePicture: base64String,
			};

			this.userService
				.putUpdateProfilePicture(request)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: updatedUser => {
						this.user = updatedUser;
						this.authService.refreshCurrentUser();
						this.messageService.add({
							severity: 'success',
							summary: 'Profile picture updated successfully',
						});
					},
					error: error => {
						const errorMessage =
							this.errorHandlingService.extractErrorMessage(
								error,
							);
						this.messageService.add({
							severity: 'error',
							summary: 'Profile picture update failed',
							detail: errorMessage,
						});
					},
				});
		};

		reader.onerror = () => {
			this.messageService.add({
				severity: 'error',
				summary: 'File read error',
				detail: 'Could not read the selected file',
			});
		};

		reader.readAsDataURL(file);
	}

	triggerFileUpload() {
		if (this.isOwnProfile) {
			const fileInput = document.getElementById(
				'fileInput',
			) as HTMLInputElement;
			fileInput?.click();
		}
	}

	deleteProfilePicture() {
		if (!this.isOwnProfile || !this.user) return;

		const request: RequestUpdateProfilePictureDto = {
			email: this.user.email,
			profilePicture: '',
		};

		this.userService
			.putUpdateProfilePicture(request)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: updatedUser => {
					this.user = updatedUser;
					this.authService.refreshCurrentUser();
					this.messageService.add({
						severity: 'success',
						summary: 'Profile picture removed successfully',
					});
				},
				error: error => {
					const errorMessage =
						this.errorHandlingService.extractErrorMessage(error);
					this.messageService.add({
						severity: 'error',
						summary: 'Failed to remove profile picture',
						detail: errorMessage,
					});
				},
			});
	}

	canEditProfile(): boolean {
		if (this.isOwnProfile) return true;

		if (!this.currentUser?.permissions) return false;

		return (
			this.currentUser.permissions.includes('MANAGE_PERMISSIONS') ||
			this.currentUser.permissions.includes('MANAGE_USERNAMES')
		);
	}

	formatPermissionLabel(permission: string): string {
		return permission
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b\w/g, l => l.toUpperCase());
	}
}
