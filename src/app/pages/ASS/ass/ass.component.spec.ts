import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssComponent } from './ass.component';

describe('AssComponent', () => {
  let component: AssComponent;
  let fixture: ComponentFixture<AssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
