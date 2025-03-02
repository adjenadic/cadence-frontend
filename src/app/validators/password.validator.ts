import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		return control.value?.length == 0 || control.value?.length >= 10
			? null
			: { weakPassword: true };
	};
}
