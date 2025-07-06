import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';

import { ChirpService } from '../../services/user-service/chirp.service';
import { AuthService } from '../../services/user-service/auth.service';
import { UserService } from '../../services/user-service/user.service';
import { MessageService } from 'primeng/api';
import { ResponseChirpDto } from '../../dtos/response-chirp-dto';
import { ResponseUserDto } from '../../dtos/response-user-dto';
import { RequestCreateChirpDto } from '../../dtos/request-create-chirp-dto';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-chirps',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		CardModule,
		ButtonModule,
		TextareaModule,
		AvatarModule,
		ToastModule,
	],
	templateUrl: './chirps.component.html',
	styleUrl: './chirps.component.css',
})
export class ChirpsComponent implements OnInit, OnDestroy, OnChanges {
	@Input() profileUser: ResponseUserDto | null = null;

	chirps: ResponseChirpDto[] = [];
	currentUser: ResponseUserDto | null = null;
	isAuthenticated = false;
	newChirpContent = '';
	isSubmitting = false;
	isLoading = true;

	private destroy$ = new Subject<void>();

	constructor(
		private chirpService: ChirpService,
		private authService: AuthService,
		private userService: UserService,
		private messageService: MessageService,
		private router: Router,
	) {}

	ngOnInit() {
		this.loadChirps();

		this.authService
			.isAuthenticated()
			.pipe(takeUntil(this.destroy$))
			.subscribe(isAuth => {
				this.isAuthenticated = isAuth;
				if (isAuth) {
					this.loadCurrentUser();
				}
			});

		this.authService
			.getCurrentUser()
			.pipe(takeUntil(this.destroy$))
			.subscribe(user => {
				const previousUser = this.currentUser;
				this.currentUser = user;

				if (
					previousUser &&
					user &&
					previousUser.profilePicture !== user.profilePicture
				) {
					this.loadChirps();
				}
			});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['profileUser']) {
			const previousUser = changes['profileUser'].previousValue;
			const currentUser = changes['profileUser'].currentValue;

			if (
				!previousUser ||
				!currentUser ||
				previousUser.id !== currentUser.id ||
				previousUser.profilePicture !== currentUser.profilePicture
			) {
				this.loadChirps();
			}
		}
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	loadCurrentUser() {
		this.authService
			.getCurrentUser()
			.pipe(takeUntil(this.destroy$))
			.subscribe(user => {
				this.currentUser = user;
			});
	}

	loadChirps() {
		if (!this.profileUser) return;

		this.isLoading = true;
		this.chirpService
			.getFindChirpsByUserId(this.profileUser.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: chirps => {
					this.chirps = chirps;
					this.isLoading = false;
				},
				error: () => {
					this.isLoading = false;
				},
			});
	}

	submitChirp() {
		if (
			!this.newChirpContent.trim() ||
			!this.currentUser ||
			!this.profileUser ||
			this.isSubmitting
		) {
			return;
		}

		this.isSubmitting = true;

		const chirpRequest: RequestCreateChirpDto = {
			content: this.newChirpContent.trim(),
			userId: this.profileUser.id,
			chirperId: this.currentUser.id,
		};

		this.chirpService
			.postCreateChirps(chirpRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.newChirpContent = '';
					this.isSubmitting = false;
					this.loadChirps();
					this.messageService.add({
						severity: 'success',
						summary: 'Chirp posted!',
					});
				},
				error: () => {
					this.isSubmitting = false;
					this.messageService.add({
						severity: 'error',
						summary: 'Failed to post chirp',
					});
				},
			});
	}

	deleteChirp(chirpId: number) {
		this.chirpService
			.deleteChirpById(chirpId)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.loadChirps();
					this.messageService.add({
						severity: 'success',
						summary: 'Chirp deleted',
					});
				},
				error: () => {
					this.messageService.add({
						severity: 'error',
						summary: 'Failed to delete chirp',
					});
				},
			});
	}

	canDeleteChirp(chirp: ResponseChirpDto): boolean {
		return !!(
			this.currentUser?.id === chirp.chirperId ||
			this.currentUser?.permissions?.includes('DELETE_COMMENTS')
		);
	}

	getChirperProfilePictureUrl(chirp: ResponseChirpDto): string {
		if (!chirp.chirperProfilePicture) {
			return 'assets/default-avatar.png';
		}
		return `data:image/jpeg;base64,${chirp.chirperProfilePicture}`;
	}

	getChirperDisplayName(chirp: ResponseChirpDto): string {
		if (this.currentUser?.id === chirp.chirperId) {
			return 'You';
		}
		return chirp.chirperUsername || `User ${chirp.chirperId}`;
	}

	shouldShowProfileLink(chirp: ResponseChirpDto): boolean {
		return !!(
			chirp.chirperUsername &&
			chirp.chirperUsername !== this.profileUser?.username &&
			this.currentUser?.id !== chirp.chirperId
		);
	}

	navigateToChirperProfile(chirp: ResponseChirpDto) {
		if (chirp.chirperUsername && this.shouldShowProfileLink(chirp)) {
			this.router.navigate(['/profile', chirp.chirperUsername]);
		}
	}

	formatTimestamp(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}
}
