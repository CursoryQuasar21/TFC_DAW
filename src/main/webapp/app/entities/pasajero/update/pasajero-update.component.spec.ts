jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PasajeroService } from '../service/pasajero.service';
import { IPasajero, Pasajero } from '../pasajero.model';
import { IAvion } from 'app/entities/avion/avion.model';
import { AvionService } from 'app/entities/avion/service/avion.service';

import { PasajeroUpdateComponent } from './pasajero-update.component';

describe('Component Tests', () => {
  describe('Pasajero Management Update Component', () => {
    let comp: PasajeroUpdateComponent;
    let fixture: ComponentFixture<PasajeroUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pasajeroService: PasajeroService;
    let avionService: AvionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PasajeroUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PasajeroUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PasajeroUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pasajeroService = TestBed.inject(PasajeroService);
      avionService = TestBed.inject(AvionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Avion query and add missing value', () => {
        const pasajero: IPasajero = { id: 456 };
        const avion: IAvion = { id: 53469 };
        pasajero.avion = avion;

        const avionCollection: IAvion[] = [{ id: 61871 }];
        spyOn(avionService, 'query').and.returnValue(of(new HttpResponse({ body: avionCollection })));
        const additionalAvions = [avion];
        const expectedCollection: IAvion[] = [...additionalAvions, ...avionCollection];
        spyOn(avionService, 'addAvionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pasajero });
        comp.ngOnInit();

        expect(avionService.query).toHaveBeenCalled();
        expect(avionService.addAvionToCollectionIfMissing).toHaveBeenCalledWith(avionCollection, ...additionalAvions);
        expect(comp.avionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const pasajero: IPasajero = { id: 456 };
        const avion: IAvion = { id: 46331 };
        pasajero.avion = avion;

        activatedRoute.data = of({ pasajero });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pasajero));
        expect(comp.avionsSharedCollection).toContain(avion);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pasajero = { id: 123 };
        spyOn(pasajeroService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pasajero });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pasajero }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pasajeroService.update).toHaveBeenCalledWith(pasajero);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pasajero = new Pasajero();
        spyOn(pasajeroService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pasajero });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pasajero }));
        saveSubject.complete();

        // THEN
        expect(pasajeroService.create).toHaveBeenCalledWith(pasajero);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pasajero = { id: 123 };
        spyOn(pasajeroService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pasajero });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pasajeroService.update).toHaveBeenCalledWith(pasajero);
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
