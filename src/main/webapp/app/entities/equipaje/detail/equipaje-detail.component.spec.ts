import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EquipajeDetailComponent } from './equipaje-detail.component';

describe('Component Tests', () => {
  describe('Equipaje Management Detail Component', () => {
    let comp: EquipajeDetailComponent;
    let fixture: ComponentFixture<EquipajeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EquipajeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ equipaje: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EquipajeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EquipajeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load equipaje on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.equipaje).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
