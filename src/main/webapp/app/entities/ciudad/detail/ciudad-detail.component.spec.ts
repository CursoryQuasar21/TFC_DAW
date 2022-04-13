import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CiudadDetailComponent } from './ciudad-detail.component';

describe('Component Tests', () => {
  describe('Ciudad Management Detail Component', () => {
    let comp: CiudadDetailComponent;
    let fixture: ComponentFixture<CiudadDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CiudadDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ ciudad: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CiudadDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CiudadDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load ciudad on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.ciudad).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
