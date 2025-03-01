import { Component, OnInit, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-nav-bar',
	imports: [
		Menubar,
		BadgeModule,
		AvatarModule,
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

	@HostListener('window:scroll', [])
	onWindowScroll() {
		this.isScrolled = window.scrollY > 0;
	}

	ngOnInit() {
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
}
