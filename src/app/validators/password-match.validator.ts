import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
	passwordField: string = 'password',
	confirmField: string = 'confirmedPassword',
): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const password = control.get(passwordField);
		const confirmedPassword = control.get(confirmField);
		console.log(password);
		console.log(confirmedPassword);
		return password &&
			confirmedPassword &&
			password.value === confirmedPassword.value
			? null
			: { passwordMismatch: true };
	};
}
