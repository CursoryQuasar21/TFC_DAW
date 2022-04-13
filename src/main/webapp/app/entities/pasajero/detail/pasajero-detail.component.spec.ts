import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PasajeroDetailComponent } from './pasajero-detail.component';

describe('Component Tests', () => {
  describe('Pasajero Management Detail Component', () => {
    let comp: PasajeroDetailComponent;
    let fixture: ComponentFixture<PasajeroDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PasajeroDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ pasajero: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PasajeroDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PasajeroDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load pasajero on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pasajero).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
