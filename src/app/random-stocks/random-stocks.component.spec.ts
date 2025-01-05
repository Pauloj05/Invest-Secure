import { ComponentFixture, TestBed } from '@angular/core/testing';

import { randomstocksComponent } from './random-stocks.component';

describe('RandomStocksComponent', () => {
  let component: randomstocksComponent;
  let fixture: ComponentFixture<randomstocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [randomstocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(randomstocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
