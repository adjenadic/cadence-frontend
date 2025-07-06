import { Component, OnInit, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/user-service/auth.service';
import { ResponseUserDto } from '../../dtos/response-user-dto';
import { MusicService } from '../../services/music-service/music.service';

interface SearchResultItem {
	id: string;
	displayName: string;
	type: 'Artist' | 'Album';
	subtitle?: string;
	image?: string;
	routerLink: string[];
}

@Component({
	selector: 'app-nav-bar',
	imports: [
		BadgeModule,
		AvatarModule,
		MenuModule,
		ButtonModule,
		InputTextModule,
		AutoCompleteModule,
		FormsModule,
		CommonModule,
		RouterModule,
	],
	standalone: true,
	templateUrl: './nav-bar.component.html',
	styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
	isScrolled = false;
	isAuthenticated = false;
	userMenuItems: MenuItem[] | undefined;
	currentUser: ResponseUserDto | null = null;
	userProfileImage: string = 'assets/default-avatar.png';

	selectedItem: SearchResultItem | null = null;
	searchResults: SearchResultItem[] = [];

	constructor(
		private authService: AuthService,
		private musicService: MusicService,
		private router: Router,
	) {}

	@HostListener('window:scroll', [])
	onWindowScroll() {
		this.isScrolled = window.scrollY > 0;
	}

	ngOnInit() {
		this.authService.isAuthenticated().subscribe(isAuth => {
			this.isAuthenticated = isAuth;
			if (isAuth) {
				this.loadCurrentUser();
			} else {
				this.updateUserMenu();
			}
		});
	}

	search(event: any) {
		const query = event.query;
		if (query.length < 2) {
			this.searchResults = [];
			return;
		}

		this.musicService.searchAll(query).subscribe(results => {
			this.searchResults = [
				...results.artists.map(artist => ({
					id: artist.id,
					displayName: artist.strArtist,
					type: 'Artist' as const,
					subtitle: artist.strGenre,
					image: artist.strArtistThumb,
					routerLink: ['/artist', artist.id],
				})),
				...results.albums.map(album => ({
					id: album.id,
					displayName: album.strAlbum,
					type: 'Album' as const,
					subtitle: album.strArtist,
					image: album.strAlbumThumb,
					routerLink: ['/album', album.id],
				})),
			].slice(0, 8);
		});
	}

	onItemSelect(event: any) {
		const item: SearchResultItem = event.value;
		this.router.navigate(item.routerLink);
		this.selectedItem = null;
	}

	getItemImage(item: SearchResultItem): string {
		return (
			item.image ||
			(item.type === 'Artist'
				? 'assets/default-artist.png'
				: 'assets/default-album.png')
		);
	}

	updateUserMenu() {
		if (this.isAuthenticated && this.currentUser?.username) {
			this.userMenuItems = [
				{
					label: 'Profile',
					icon: 'pi pi-user',
					routerLink: ['/profile', this.currentUser.username],
				},
				{
					label: 'Log out',
					icon: 'pi pi-sign-out',
					command: () => this.logout(),
				},
			];
		}
	}

	loadCurrentUser() {
		this.authService.getCurrentUser().subscribe(user => {
			this.currentUser = user;
			this.userProfileImage = this.getProfilePictureUrl(user);
			this.updateUserMenu();
		});
	}

	getProfilePictureUrl(user: any): string {
		if (!user?.profilePicture) {
			return 'assets/default-avatar.png';
		}
		return `data:image/jpeg;base64,${user.profilePicture}`;
	}

	logout() {
		this.authService.logout();
	}
}
