import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeContactInfoComponent } from './change-contact-info.component';

describe('ChangeContactInfoComponent', () => {
  let component: ChangeContactInfoComponent;
  let fixture: ComponentFixture<ChangeContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeContactInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
