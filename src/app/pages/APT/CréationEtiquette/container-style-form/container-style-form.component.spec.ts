import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerStyleFormComponent } from './container-style-form.component';

describe('ContainerStyleFormComponent', () => {
  let component: ContainerStyleFormComponent;
  let fixture: ComponentFixture<ContainerStyleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerStyleFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerStyleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
