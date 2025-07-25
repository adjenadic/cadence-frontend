import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { ApiEndpoints } from '../api.endpoints';
import { AlbumSummaryDto } from '../../dtos/album-summary-dto';
import { ArtistSummaryDto } from '../../dtos/artist-summary-dto';

@Injectable({
	providedIn: 'root',
})
export class MusicService {
	constructor(private httpClient: HttpClient) {}

	searchAll(query: string) {
		return this.httpClient.get<{
			artists: ArtistSummaryDto[];
			albums: AlbumSummaryDto[];
		}>(environment.musicServiceApiUrl + ApiEndpoints.music.search(query));
	}

	getAlbumById(id: string) {
		return this.httpClient.get<AlbumSummaryDto>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getAlbumById(id),
		);
	}

	getRandomAlbums(count: number) {
		return this.httpClient.get<AlbumSummaryDto[]>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getRandomAlbums(count),
		);
	}

	getNewestAlbums(count: number) {
		return this.httpClient.get<AlbumSummaryDto[]>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getNewestAlbums(count),
		);
	}

	getTopSellingAlbums(count: number) {
		return this.httpClient.get<AlbumSummaryDto[]>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getTopSellingAlbums(count),
		);
	}

	getAlbumsByArtist(artistId: number) {
		return this.httpClient.get<AlbumSummaryDto[]>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getAlbumsByArtist(artistId),
		);
	}

	getArtistById(idArtist: string) {
		return this.httpClient.get<ArtistSummaryDto>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getArtistById(idArtist),
		);
	}

	getRandomArtists(count: number) {
		return this.httpClient.get<ArtistSummaryDto[]>(
			environment.musicServiceApiUrl +
				ApiEndpoints.music.getRandomArtists(count),
		);
	}
}
