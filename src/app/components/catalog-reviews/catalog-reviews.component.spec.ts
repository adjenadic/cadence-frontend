import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogReviewsComponent } from './catalog-reviews.component';

describe('CatalogReviewsComponent', () => {
  let component: CatalogReviewsComponent;
  let fixture: ComponentFixture<CatalogReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
