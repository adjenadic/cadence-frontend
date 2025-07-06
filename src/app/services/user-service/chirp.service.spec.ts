import { TestBed } from '@angular/core/testing';

import { ChirpService } from './chirp.service';

describe('ChirpService', () => {
	let service: ChirpService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ChirpService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
