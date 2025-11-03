import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutRequestsComponent } from './payout-requests.component';

describe('PayoutRequestsComponent', () => {
  let component: PayoutRequestsComponent;
  let fixture: ComponentFixture<PayoutRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayoutRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
