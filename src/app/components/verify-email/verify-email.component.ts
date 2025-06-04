import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorHandlingService } from '../../services/error-handling-service/error-handling.service';
import { UserService } from '../../services/user-service/user.service';
import { ToastModule } from 'primeng/toast';

@Component({
	template: `
		<div style="text-align: center; padding: 2rem;">
			<p style="white-space: pre-line;">{{ verificationMessage }}</p>
		</div>
	`,
	imports: [ToastModule],
})
export class VerifyEmailComponent implements OnInit {
	verificationMessage = 'Verifying your email...';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private errorHandlingService: ErrorHandlingService,
		private userService: UserService,
		private messageService: MessageService,
	) {}

	ngOnInit() {
		const token = this.route.snapshot.queryParams['token'];
		if (token) {
			this.userService.postVerifyEmail(token).subscribe({
				next: response => {
					this.verificationMessage =
						'Email verified.\nRedirecting...';
					this.messageService.add({
						severity: 'success',
						summary: 'Email verified successfully!',
						detail: 'You can log in now!',
					});
					setTimeout(() => this.router.navigate(['/']), 3000);
				},
				error: error => {
					if (error.status === 409) {
						this.verificationMessage =
							'Email already verified.\nRedirecting...';
						this.messageService.add({
							severity: 'info',
							summary: 'Email already verified',
							detail: 'You can log in now!',
						});
					} else {
						this.verificationMessage =
							'Verification failed.\nRedirecting...';
						const errorMessage =
							this.errorHandlingService.extractErrorMessage(
								error,
							);
						this.messageService.add({
							severity: 'error',
							summary: 'Email verification failed',
							detail: errorMessage,
						});
					}
					setTimeout(() => this.router.navigate(['/']), 3000);
				},
			});
		}
	}
}
