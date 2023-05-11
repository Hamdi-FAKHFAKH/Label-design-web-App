import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelComponentComponent } from './label-component.component';

describe('LabelComponentComponent', () => {
  let component: LabelComponentComponent;
  let fixture: ComponentFixture<LabelComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
