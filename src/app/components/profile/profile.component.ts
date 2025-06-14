import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user-service/user.service';
import { AuthService } from '../../services/user-service/auth.service';
import { ResponseUserDto } from '../../dtos/response-user-dto';
import { RequestUpdateUsernameDto } from '../../dtos/request-update-username-dto';
import { RequestUpdateEmailDto } from '../../dtos/request-update-email-dto';
import { RequestUpdatePronounsDto } from '../../dtos/request-update-pronouns-dto';
import { RequestUpdateAboutMeDto } from '../../dtos/request-update-about-me-dto';
import { RequestUpdateProfilePictureDto } from '../../dtos/request-update-profile-picture-dto';

@Component({
	selector: 'app-profile',
	standalone: true, // Mark as standalone if it's not already
	imports: [CommonModule, FormsModule],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
	user: ResponseUserDto | null = null;
	currentUser: ResponseUserDto | null = null;
	isOwnProfile = false;
	isLoading = true;

	// Explicitly define the properties to allow dot notation access in the template
	editMode: {
		username: boolean;
		email: boolean;
		pronouns: boolean;
		aboutMe: boolean;
	} = {
		username: false,
		email: false,
		pronouns: false,
		aboutMe: false,
	};

	// Explicitly define the properties for editValues, making them optional initially
	editValues: {
		username?: string;
		email?: string;
		pronouns?: string;
		aboutMe?: string;
	} = {};

	private destroy$ = new Subject<void>();

	constructor(
		private route: ActivatedRoute,
		private userService: UserService,
		private authService: AuthService,
	) {}

	ngOnInit() {
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
			const username = params['username'];
			if (username) {
				this.loadUserProfile(username);
			}
		});

		this.loadCurrentUser();
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
					// Initialize editValues with current user data AFTER user is loaded
					if (this.user) {
						this.editValues.username = this.user.username;
						this.editValues.email = this.user.email;
						this.editValues.pronouns = this.user.pronouns;
						this.editValues.aboutMe = this.user.aboutMe;
					}
				},
				error: () => {
					this.isLoading = false;
					this.user = null; // Set user to null on error to show "User not found"
				},
			});
	}

	loadCurrentUser() {
		this.authService
			.getCurrentUser()
			.pipe(takeUntil(this.destroy$))
			.subscribe(currentUser => {
				this.currentUser = currentUser;
				this.checkIfOwnProfile();
			});
	}

	checkIfOwnProfile() {
		this.isOwnProfile = !!(
			this.user &&
			this.currentUser &&
			this.user.username === this.currentUser.username
		);
	}

	// Use 'keyof typeof this.editMode' for better type safety
	startEdit(field: keyof typeof this.editMode) {
		if (!this.isOwnProfile || !this.user) return;

		this.editMode[field] = true;
		// Safely assign the user's current value to the edit field
		// Cast 'this.user' to 'any' if ResponseUserDto doesn't explicitly declare these properties as string
		this.editValues[field] = (this.user as any)[field];
	}

	// Use 'keyof typeof this.editMode' for better type safety
	cancelEdit(field: keyof typeof this.editMode) {
		this.editMode[field] = false;
		// Revert to the original value from the user object
		if (this.user) {
			this.editValues[field] = (this.user as any)[field];
		} else {
			// If user is somehow null, clear the edit value
			delete this.editValues[field];
		}
	}

	// Use 'keyof typeof this.editMode' for better type safety
	saveEdit(field: keyof typeof this.editMode) {
		// Ensure user exists and the field has a value before proceeding
		if (!this.user || this.editValues[field] === undefined) return;

		// Use non-null assertion '!' as we've checked for undefined/null
		const value = this.editValues[field]!;
		let request: any;
		let updateMethod: any;

		// Assuming user.email is always available if this.user is not null
		switch (field) {
			case 'username':
				request = {
					email: this.user.email,
					username: value,
				} as RequestUpdateUsernameDto;
				updateMethod = this.userService.putUpdateUsername(request);
				break;
			case 'email':
				request = {
					currentEmail: this.user.email,
					updatedEmail: value,
				} as RequestUpdateEmailDto;
				updateMethod = this.userService.putUpdateEmail(request);
				break;
			case 'pronouns':
				request = {
					email: this.user.email,
					pronouns: value,
				} as RequestUpdatePronounsDto;
				updateMethod = this.userService.putUpdatePronouns(request);
				break;
			case 'aboutMe':
				request = {
					email: this.user.email,
					aboutMe: value,
				} as RequestUpdateAboutMeDto;
				updateMethod = this.userService.putUpdateAboutMe(request);
				break;
			default:
				return;
		}

		updateMethod.pipe(takeUntil(this.destroy$)).subscribe({
			next: (updatedUser: ResponseUserDto) => {
				this.user = updatedUser; // Update the user object with the fresh data
				this.editMode[field] = false; // Exit edit mode for this field
				// Re-initialize editValues with the new user data to ensure consistency
				if (this.user) {
					this.editValues.username = this.user.username;
					this.editValues.email = this.user.email;
					this.editValues.pronouns = this.user.pronouns;
					this.editValues.aboutMe = this.user.aboutMe;
				}
			},
			error: (error: any) => {
				console.error('Update failed:', error);
				// Consider reverting editMode and editValues on error if desired
			},
		});
	}

	onFileSelected(event: any) {
		// Ensure user and file exist and it's the own profile
		if (!this.isOwnProfile || !this.user || !event.target.files?.length)
			return;

		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = e => {
			const base64String = (e.target?.result as string).split(',')[1];
			const request: RequestUpdateProfilePictureDto = {
				email: this.user!.email, // Use non-null assertion for user.email
				profilePicture: base64String,
			};

			this.userService
				.putUpdateProfilePicture(request)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: updatedUser => {
						this.user = updatedUser; // Update the user object with the new profile picture
					},
					error: error => {
						console.error('Profile picture update failed:', error);
					},
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
}
