import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PrimeNG } from 'primeng/config';

@Component({
	selector: 'app-root',
	imports: [RouterModule, CommonModule, NavBarComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
	title = 'cadence-frontend';
	showToolbar = true;
	showBackgroundImage = false;

	constructor(private router: Router, private primeng: PrimeNG) {}

	ngOnInit() {
		this.primeng.ripple.set(true);
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				const excludedRoutes = ['/login', '/register'];
				this.showToolbar = !excludedRoutes.includes(event.url);
				this.showBackgroundImage = excludedRoutes.includes(event.url);
			}
		});
	}
}
