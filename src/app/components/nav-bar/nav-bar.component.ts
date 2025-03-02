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

	constructor(private authService: AuthService) {}

	@HostListener('window:scroll', [])
	onWindowScroll() {
		this.isScrolled = window.scrollY > 0;
	}

	ngOnInit() {
		this.authService.isAuthenticated().subscribe(isAuth => {
			this.isAuthenticated = isAuth;
			this.updateUserMenu();
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

		this.updateUserMenu();
	}

	updateUserMenu() {
		if (this.isAuthenticated) {
			this.userMenuItems = [
				{
					label: 'Profile',
					icon: 'pi pi-user',
					routerLink: ['/profile'],
				},
				{
					label: 'Log out',
					icon: 'pi pi-sign-out',
					command: () => this.logout(),
				},
			];
		}
	}

	logout() {
		this.authService.logout();
	}
}
