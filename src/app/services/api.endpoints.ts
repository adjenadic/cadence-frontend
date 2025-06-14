export const ApiEndpoints = {
	// AuthService
	auth: {
		// POST
		postLogin: 'auth/login',
	},

	// UserService
	users: {
		// GET
		getAll: 'users/all',
		getById: 'users',
		getByEmail: 'users/email',
		getByUsername: 'users/username',
		// POST
		postCreate: 'users/create',
		postVerifyEmail: 'users/verify-email?verificationToken=',
		// PUT
		putUpdateEmail: 'users/email',
		putUpdateUsername: 'users/username',
		putUpdatePassword: 'users/password',
		putUpdatePronouns: 'users/pronouns',
		putUpdateAboutMe: 'users/about-me',
		putUpdateProfilePicture: 'users/profile-picture',
		putUpdatePermissions: 'users/permissions',
		// DELETE
		deleteById: 'users',
		deleteByEmail: 'users',
	},

	// CommentService
	comments: {
		// GET
		getByUserId: 'comments/user-id',
		getById: 'comments',
		// POST
		postCreate: 'comments/create',
		// PUT
		putUpdate: 'comments/update',
		putLike: 'comments/like',
		putUnlike: 'comments/unlike',
		// DELETE
		deleteById: 'comments/delete',
	},
};
