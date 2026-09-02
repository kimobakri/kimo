import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedOrders } from './confirmed-orders';

describe('ConfirmedOrders', () => {
  let component: ConfirmedOrders;
  let fixture: ComponentFixture<ConfirmedOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmedOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmedOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
