import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { ApiEndpoints } from '../api.endpoints';
import { ResponseUserDto } from '../../dtos/response-user-dto';
import { RequestCreateUserDto } from '../../dtos/request-create-user-dto';
import { RequestUpdateEmailDto } from '../../dtos/request-update-email-dto';
import { RequestUpdateUsernameDto } from '../../dtos/request-update-username-dto';
import { RequestUpdatePasswordDto } from '../../dtos/request-update-password-dto';
import { RequestUpdatePronounsDto } from '../../dtos/request-update-pronouns-dto';
import { RequestUpdateAboutMeDto } from '../../dtos/request-update-about-me-dto';
import { RequestUpdateProfilePictureDto } from '../../dtos/request-update-profile-picture-dto';
import { RequestUpdatePermissionsDto } from '../../dtos/request-update-permissions-dto';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(private httpClient: HttpClient) {}

	getFindAllUsers() {
		return this.httpClient.get<ResponseUserDto[]>(
			environment.userServiceApiUrl + ApiEndpoints.users.getAll,
		);
	}

	getFindUserById(id: number) {
		return this.httpClient.get<ResponseUserDto>(
			environment.userServiceApiUrl + ApiEndpoints.users.getById(id),
		);
	}

	getFindUserByEmail(email: string) {
		return this.httpClient.get<ResponseUserDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.getByEmail(email),
		);
	}

	getFindUserByUsername(username: string) {
		return this.httpClient.get<ResponseUserDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.getByUsername(username),
		);
	}

	postCreateUser(user: RequestCreateUserDto) {
		return this.httpClient.post<boolean>(
			environment.userServiceApiUrl + ApiEndpoints.users.postCreate,
			user,
		);
	}

	postVerifyEmail(verificationToken: string) {
		return this.httpClient.post<ResponseUserDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.postVerifyEmail(verificationToken),
			{},
		);
	}

	putUpdateEmail(request: RequestUpdateEmailDto) {
		return this.httpClient.put<ResponseUserDto>(
			environment.userServiceApiUrl + ApiEndpoints.users.putUpdateEmail,
			request,
		);
	}

	putUpdateUsername(request: RequestUpdateUsernameDto) {
		return this.httpClient.put<ResponseUserDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.putUpdateUsername,
			request,
		);
	}

	putUpdatePassword(request: RequestUpdatePasswordDto) {
		return this.httpClient.put<ResponseUserDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.putUpdatePassword,
			request,
		);
	}

	putUpdatePronouns(request: RequestUpdatePronounsDto) {
		return this.httpClient.put<ResponseUserDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.putUpdatePronouns,
			request,
		);
	}

	putUpdateAboutMe(request: RequestUpdateAboutMeDto) {
		return this.httpClient.put<ResponseUserDto>(
			environment.userServiceApiUrl + ApiEndpoints.users.putUpdateAboutMe,
			request,
		);
	}

	putUpdateProfilePicture(request: RequestUpdateProfilePictureDto) {
		return this.httpClient.put<ResponseUserDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.putUpdateProfilePicture,
			request,
		);
	}

	putUpdatePermissions(request: RequestUpdatePermissionsDto) {
		return this.httpClient.put<ResponseUserDto>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.putUpdatePermissions,
			request,
		);
	}

	deleteUserById(id: number) {
		return this.httpClient.delete<boolean>(
			environment.userServiceApiUrl + ApiEndpoints.users.deleteById(id),
		);
	}

	deleteUserByEmail(email: string) {
		return this.httpClient.delete<boolean>(
			environment.userServiceApiUrl +
				ApiEndpoints.users.deleteByEmail(email),
		);
	}
}
