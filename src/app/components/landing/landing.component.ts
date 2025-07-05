import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MusicService } from '../../services/music-service/music.service';
import { AlbumSummaryDto } from '../../dtos/album-summary-dto';
import { ArtistSummaryDto } from '../../dtos/artist-summary-dto';

@Component({
	selector: 'app-landing',
	imports: [CommonModule, CardModule],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
	featuredAlbums: AlbumSummaryDto[] = [];
	featuredArtists: ArtistSummaryDto[] = [];
	newestAlbums: AlbumSummaryDto[] = [];
	topSellingAlbums: AlbumSummaryDto[] = [];
	loading = true;

	constructor(private musicService: MusicService, private router: Router) {}

	ngOnInit() {
		this.loadAllData();
	}

	loadAllData() {
		Promise.all([
			this.musicService.getRandomAlbums(8).toPromise(),
			this.musicService.getRandomArtists(8).toPromise(),
			this.musicService.getNewestAlbums(8).toPromise(),
			this.musicService.getTopSellingAlbums(8).toPromise(),
		])
			.then(
				([
					featuredAlbums,
					featuredArtists,
					newestAlbums,
					topSellingAlbums,
				]) => {
					this.featuredAlbums = featuredAlbums || [];
					this.featuredArtists = featuredArtists || [];
					this.newestAlbums = newestAlbums || [];
					this.topSellingAlbums = topSellingAlbums || [];
					this.loading = false;
				},
			)
			.catch(error => {
				console.error('Error loading data:', error);
				this.loading = false;
			});
	}

	onAlbumClick(album: AlbumSummaryDto) {
		this.router.navigate(['/album', album.id]);
	}

	onArtistClick(artist: ArtistSummaryDto) {
		this.router.navigate(['/artist', artist.id]);
	}
}
