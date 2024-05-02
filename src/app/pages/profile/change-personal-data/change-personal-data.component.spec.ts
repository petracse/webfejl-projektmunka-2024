import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePersonalDataComponent } from './change-personal-data.component';

describe('ChangePersonalDataComponent', () => {
  let component: ChangePersonalDataComponent;
  let fixture: ComponentFixture<ChangePersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePersonalDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangePersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
