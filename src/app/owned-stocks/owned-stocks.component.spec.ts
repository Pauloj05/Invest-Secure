import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnedStocksComponent } from './owned-stocks.component';

describe('OwnedStocksComponent', () => {
  let component: OwnedStocksComponent;
  let fixture: ComponentFixture<OwnedStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnedStocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnedStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
