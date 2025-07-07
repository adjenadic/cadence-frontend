import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MusicService } from '../../services/music-service/music.service';
import { AlbumSummaryDto } from '../../dtos/album-summary-dto';
import { CatalogReviewsComponent } from '../catalog-reviews/catalog-reviews.component';

@Component({
	selector: 'app-album-detail',
	imports: [CommonModule, CardModule, ButtonModule, CatalogReviewsComponent],
	templateUrl: './album-detail.component.html',
	styleUrl: './album-detail.component.css',
})
export class AlbumDetailComponent implements OnInit {
	album: AlbumSummaryDto | null = null;
	relatedAlbums: AlbumSummaryDto[] = [];
	loading = true;
	loadingRelated = false;
	albumId: string = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private musicService: MusicService,
	) {}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.albumId = params['id'];
			this.loadAlbum();
		});
	}

	loadAlbum() {
		this.musicService.getAlbumById(this.albumId).subscribe({
			next: album => {
				this.album = album;
				this.loading = false;
				this.loadRelatedAlbums();
			},
			error: error => {
				console.error('Error loading album:', error);
				this.loading = false;
			},
		});
	}

	loadRelatedAlbums() {
		if (this.album && this.album.idArtist) {
			this.loadingRelated = true;
			this.musicService.getAlbumsByArtist(this.album.idArtist).subscribe({
				next: albums => {
					this.relatedAlbums = albums.filter(
						a => a.id !== this.album?.id,
					);
					this.loadingRelated = false;
				},
				error: error => {
					console.error('Error loading related albums:', error);
					this.loadingRelated = false;
				},
			});
		}
	}

	onBackClick() {
		this.router.navigate(['/']);
	}

	onArtistClick() {
		if (this.album && this.album.idArtist) {
			this.router.navigate(['/artist', this.album.idArtist]);
		}
	}

	onRelatedAlbumClick(album: AlbumSummaryDto) {
		this.router.navigate(['/album', album.id]);
	}

	onReviewSubmitted() {
		this.loadAlbum();
	}
}
