jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EquipajeService } from '../service/equipaje.service';
import { IEquipaje, Equipaje } from '../equipaje.model';
import { IPasajero } from 'app/entities/pasajero/pasajero.model';
import { PasajeroService } from 'app/entities/pasajero/service/pasajero.service';

import { EquipajeUpdateComponent } from './equipaje-update.component';

describe('Component Tests', () => {
  describe('Equipaje Management Update Component', () => {
    let comp: EquipajeUpdateComponent;
    let fixture: ComponentFixture<EquipajeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let equipajeService: EquipajeService;
    let pasajeroService: PasajeroService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EquipajeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EquipajeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EquipajeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      equipajeService = TestBed.inject(EquipajeService);
      pasajeroService = TestBed.inject(PasajeroService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Pasajero query and add missing value', () => {
        const equipaje: IEquipaje = { id: 456 };
        const pasajero: IPasajero = { id: 84255 };
        equipaje.pasajero = pasajero;

        const pasajeroCollection: IPasajero[] = [{ id: 27070 }];
        spyOn(pasajeroService, 'query').and.returnValue(of(new HttpResponse({ body: pasajeroCollection })));
        const additionalPasajeros = [pasajero];
        const expectedCollection: IPasajero[] = [...additionalPasajeros, ...pasajeroCollection];
        spyOn(pasajeroService, 'addPasajeroToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ equipaje });
        comp.ngOnInit();

        expect(pasajeroService.query).toHaveBeenCalled();
        expect(pasajeroService.addPasajeroToCollectionIfMissing).toHaveBeenCalledWith(pasajeroCollection, ...additionalPasajeros);
        expect(comp.pasajerosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const equipaje: IEquipaje = { id: 456 };
        const pasajero: IPasajero = { id: 30514 };
        equipaje.pasajero = pasajero;

        activatedRoute.data = of({ equipaje });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(equipaje));
        expect(comp.pasajerosSharedCollection).toContain(pasajero);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const equipaje = { id: 123 };
        spyOn(equipajeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ equipaje });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: equipaje }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(equipajeService.update).toHaveBeenCalledWith(equipaje);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const equipaje = new Equipaje();
        spyOn(equipajeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ equipaje });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: equipaje }));
        saveSubject.complete();

        // THEN
        expect(equipajeService.create).toHaveBeenCalledWith(equipaje);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const equipaje = { id: 123 };
        spyOn(equipajeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ equipaje });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(equipajeService.update).toHaveBeenCalledWith(equipaje);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPasajeroById', () => {
        it('Should return tracked Pasajero primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPasajeroById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
