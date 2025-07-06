import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChirpsComponent } from './chirps.component';

describe('ChirpsComponent', () => {
  let component: ChirpsComponent;
  let fixture: ComponentFixture<ChirpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChirpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChirpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
