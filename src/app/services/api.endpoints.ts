export const ApiEndpoints = {
	// AuthService
	auth: {
		// POST
		postLogin: '/api/auth/login',
	},

	// UserService
	users: {
		// GET
		getAll: '/api/users/all',
		getById: '/api/users',
		getByEmail: '/api/users',
		getByUsername: '/api/users',
		// POST
		postCreate: '/api/users/create',
		// PUT
		putUpdateEmail: '/api/users/email',
		putUpdateUsername: '/api/users/username',
		putUpdatePassword: '/api/users/password',
		putUpdatePronouns: '/api/users/pronouns',
		putUpdateAboutMe: '/api/users/about-me',
		putUpdateProfilePicture: '/api/users/password',
		putUpdatePermissions: '/api/users/permissions',
		// DELETE
		deleteById: '/api/users',
		deleteByEmail: '/api/users',
	},

	// CommentService
	comments: {
		// GET
		getByUserId: '/api/comments/user-id',
		getById: '/api/comments',
		// POST
		postCreate: '/api/comments/create',
		// PUT
		putUpdate: '/api/comments/update',
		putLike: '/api/comments/like',
		putUnlike: '/api/comments/unlike',
		// DELETE
		deleteById: '/api/comments/delete',
	},
};
