import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistContainerComponent } from './wishlist-container.component';

describe('WishlistContainerComponent', () => {
  let component: WishlistContainerComponent;
  let fixture: ComponentFixture<WishlistContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishlistContainerComponent]
    });
    fixture = TestBed.createComponent(WishlistContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
