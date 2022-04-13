jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TripulanteService } from '../service/tripulante.service';
import { ITripulante, Tripulante } from '../tripulante.model';
import { IAvion } from 'app/entities/avion/avion.model';
import { AvionService } from 'app/entities/avion/service/avion.service';

import { TripulanteUpdateComponent } from './tripulante-update.component';

describe('Component Tests', () => {
  describe('Tripulante Management Update Component', () => {
    let comp: TripulanteUpdateComponent;
    let fixture: ComponentFixture<TripulanteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tripulanteService: TripulanteService;
    let avionService: AvionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TripulanteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TripulanteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TripulanteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      tripulanteService = TestBed.inject(TripulanteService);
      avionService = TestBed.inject(AvionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Avion query and add missing value', () => {
        const tripulante: ITripulante = { id: 456 };
        const avion: IAvion = { id: 30188 };
        tripulante.avion = avion;

        const avionCollection: IAvion[] = [{ id: 12232 }];
        spyOn(avionService, 'query').and.returnValue(of(new HttpResponse({ body: avionCollection })));
        const additionalAvions = [avion];
        const expectedCollection: IAvion[] = [...additionalAvions, ...avionCollection];
        spyOn(avionService, 'addAvionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ tripulante });
        comp.ngOnInit();

        expect(avionService.query).toHaveBeenCalled();
        expect(avionService.addAvionToCollectionIfMissing).toHaveBeenCalledWith(avionCollection, ...additionalAvions);
        expect(comp.avionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const tripulante: ITripulante = { id: 456 };
        const avion: IAvion = { id: 72576 };
        tripulante.avion = avion;

        activatedRoute.data = of({ tripulante });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tripulante));
        expect(comp.avionsSharedCollection).toContain(avion);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tripulante = { id: 123 };
        spyOn(tripulanteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tripulante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tripulante }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(tripulanteService.update).toHaveBeenCalledWith(tripulante);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tripulante = new Tripulante();
        spyOn(tripulanteService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tripulante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tripulante }));
        saveSubject.complete();

        // THEN
        expect(tripulanteService.create).toHaveBeenCalledWith(tripulante);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tripulante = { id: 123 };
        spyOn(tripulanteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tripulante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(tripulanteService.update).toHaveBeenCalledWith(tripulante);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAvionById', () => {
        it('Should return tracked Avion primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAvionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
