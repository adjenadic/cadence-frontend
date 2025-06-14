import { Component, OnInit, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/user-service/auth.service';
import { ResponseUserDto } from '../../dtos/response-user-dto';

@Component({
	selector: 'app-nav-bar',
	imports: [
		Menubar,
		BadgeModule,
		AvatarModule,
		MenuModule,
		ButtonModule,
		InputTextModule,
		CommonModule,
		RouterModule,
	],
	standalone: true,
	templateUrl: './nav-bar.component.html',
	styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
	items: MenuItem[] | undefined;
	isScrolled = false;
	isAuthenticated = false;
	userMenuItems: MenuItem[] | undefined;
	currentUser: ResponseUserDto | null = null;
	userProfileImage: string = 'assets/default-avatar.png';

	constructor(private authService: AuthService) {}

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

		this.items = [
			{
				label: 'Home',
				icon: 'pi pi-home',
				routerLink: ['/home'],
			},
			{
				label: 'Projects',
				icon: 'pi pi-search',
				items: [
					{
						label: 'Core',
						icon: 'pi pi-bolt',
						routerLink: ['/projects/core'],
					},
					{
						label: 'Blocks',
						icon: 'pi pi-server',
						routerLink: ['/projects/blocks'],
					},
					{
						separator: true,
					},
					{
						label: 'UI Kit',
						icon: 'pi pi-pencil',
						routerLink: ['/projects/ui-kit'],
					},
				],
			},
		];
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
