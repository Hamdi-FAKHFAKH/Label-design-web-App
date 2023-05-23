import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueOFComponent } from './historique-of.component';

describe('HistoriqueOFComponent', () => {
  let component: HistoriqueOFComponent;
  let fixture: ComponentFixture<HistoriqueOFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueOFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueOFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
