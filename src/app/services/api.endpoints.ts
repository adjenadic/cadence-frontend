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
		getById: (id: number) => `users/${id}`,
		getByEmail: (email: string) => `users/email/${email}`,
		getByUsername: (username: string) => `users/username/${username}`,

		// POST
		postCreate: 'users/create',
		postVerifyEmail: (verificationToken: string) =>
			`users/verify-email?verificationToken=${verificationToken}`,

		// PUT
		putUpdateEmail: 'users/email',
		putUpdateUsername: 'users/username',
		putUpdatePassword: 'users/password',
		putUpdatePronouns: 'users/pronouns',
		putUpdateAboutMe: 'users/about-me',
		putUpdateProfilePicture: 'users/profile-picture',
		putUpdatePermissions: 'users/permissions',

		// DELETE
		deleteById: (id: number) => `users/${id}`,
		deleteByEmail: (email: string) => `users/email/${email}`,
	},

	// ChirpService
	chirps: {
		// GET
		getByUserId: (userId: number) => `chirps/user-id/${userId}`,
		getById: (id: number) => `chirps/${id}`,

		// POST
		postCreate: 'chirps/create',

		// PUT
		putUpdate: 'chirps/update',
		putLike: (id: number) => `chirps/like/${id}`,
		putUnlike: (id: number) => `chirps/unlike/${id}`,

		// DELETE
		deleteById: (id: number) => `chirps/delete/${id}`,
	},

	// MusicService
	music: {
		// GET
		search: (query: string) =>
			`music/search?q=${encodeURIComponent(query)}`,
		getAlbumById: (id: string) => `music/albums/${id}`,
		getRandomAlbums: (count: number) =>
			`music/albums/random?count=${count}`,
		getNewestAlbums: (count: number) =>
			`music/albums/newest?count=${count}`,
		getTopSellingAlbums: (count: number) =>
			`music/albums/top-selling?count=${count}`,
		getAlbumsByArtist: (idArtist: number) =>
			`music/albums/artist/${idArtist}`,
		getArtistById: (id: string) => `music/artists/${id}`,
		getRandomArtists: (count: number) =>
			`music/artists/random?count=${count}`,
		getAlbumReviews: (albumId: string) => `music/albums/${albumId}/reviews`,
		getUserReviews: (userId: number) => `music/users/${userId}/reviews`,

		// POST
		createReview: 'music/reviews',

		// DELETE
		deleteReview: (reviewId: string, userId: number) =>
			`music/reviews/${reviewId}?userId=${userId}`,
	},
};
