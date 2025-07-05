import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MusicService } from '../../services/music-service/music.service';
import { ArtistSummaryDto } from '../../dtos/artist-summary-dto';
import { AlbumSummaryDto } from '../../dtos/album-summary-dto';

@Component({
	selector: 'app-artist-detail',
	imports: [CommonModule, CardModule, ButtonModule],
	templateUrl: './artist-detail.component.html',
	styleUrl: './artist-detail.component.css',
})
export class ArtistDetailComponent implements OnInit {
	artist: ArtistSummaryDto | null = null;
	albums: AlbumSummaryDto[] = [];
	loading = true;
	loadingAlbums = false;
	artistId: string = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private musicService: MusicService,
	) {}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.artistId = params['id'];
			this.loadArtist();
		});
	}

	loadArtist() {
		this.musicService.getArtistById(this.artistId).subscribe({
			next: artist => {
				this.artist = artist;
				this.loading = false;
				this.loadAlbums();
			},
			error: error => {
				console.error('Error loading artist:', error);
				this.loading = false;
			},
		});
	}

	loadAlbums() {
		if (this.artist && this.artist.idArtist) {
			this.loadingAlbums = true;
			this.musicService
				.getAlbumsByArtist(this.artist.idArtist)
				.subscribe({
					next: albums => {
						this.albums = albums;
						this.loadingAlbums = false;
					},
					error: error => {
						console.error('Error loading albums:', error);
						this.loadingAlbums = false;
					},
				});
		}
	}

	getFullUrl(url: string): string {
		if (!url) return '';
		if (url.startsWith('http://') || url.startsWith('https://')) {
			return url;
		}
		return 'https://' + url;
	}

	onBackClick() {
		this.router.navigate(['/']);
	}

	onAlbumClick(album: AlbumSummaryDto) {
		this.router.navigate(['/album', album.id]);
	}
}
