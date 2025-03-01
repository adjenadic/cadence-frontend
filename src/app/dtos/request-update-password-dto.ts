export interface RequestUpdatePasswordDto {
	email: string;
	currentPassword: string;
	updatedPassword: string;
	updatedPasswordConfirmation: string;
}
