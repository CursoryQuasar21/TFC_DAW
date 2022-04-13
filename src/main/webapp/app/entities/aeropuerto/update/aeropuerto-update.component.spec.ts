jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AeropuertoService } from '../service/aeropuerto.service';
import { IAeropuerto, Aeropuerto } from '../aeropuerto.model';
import { IVuelo } from 'app/entities/vuelo/vuelo.model';
import { VueloService } from 'app/entities/vuelo/service/vuelo.service';
import { ICiudad } from 'app/entities/ciudad/ciudad.model';
import { CiudadService } from 'app/entities/ciudad/service/ciudad.service';

import { AeropuertoUpdateComponent } from './aeropuerto-update.component';

describe('Component Tests', () => {
  describe('Aeropuerto Management Update Component', () => {
    let comp: AeropuertoUpdateComponent;
    let fixture: ComponentFixture<AeropuertoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let aeropuertoService: AeropuertoService;
    let vueloService: VueloService;
    let ciudadService: CiudadService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AeropuertoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AeropuertoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AeropuertoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      aeropuertoService = TestBed.inject(AeropuertoService);
      vueloService = TestBed.inject(VueloService);
      ciudadService = TestBed.inject(CiudadService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vuelo query and add missing value', () => {
        const aeropuerto: IAeropuerto = { id: 456 };
        const vuelos: IVuelo[] = [{ id: 44016 }];
        aeropuerto.vuelos = vuelos;

        const vueloCollection: IVuelo[] = [{ id: 41290 }];
        spyOn(vueloService, 'query').and.returnValue(of(new HttpResponse({ body: vueloCollection })));
        const additionalVuelos = [...vuelos];
        const expectedCollection: IVuelo[] = [...additionalVuelos, ...vueloCollection];
        spyOn(vueloService, 'addVueloToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ aeropuerto });
        comp.ngOnInit();

        expect(vueloService.query).toHaveBeenCalled();
        expect(vueloService.addVueloToCollectionIfMissing).toHaveBeenCalledWith(vueloCollection, ...additionalVuelos);
        expect(comp.vuelosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Ciudad query and add missing value', () => {
        const aeropuerto: IAeropuerto = { id: 456 };
        const ciudad: ICiudad = { id: 57012 };
        aeropuerto.ciudad = ciudad;

        const ciudadCollection: ICiudad[] = [{ id: 10110 }];
        spyOn(ciudadService, 'query').and.returnValue(of(new HttpResponse({ body: ciudadCollection })));
        const additionalCiudads = [ciudad];
        const expectedCollection: ICiudad[] = [...additionalCiudads, ...ciudadCollection];
        spyOn(ciudadService, 'addCiudadToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ aeropuerto });
        comp.ngOnInit();

        expect(ciudadService.query).toHaveBeenCalled();
        expect(ciudadService.addCiudadToCollectionIfMissing).toHaveBeenCalledWith(ciudadCollection, ...additionalCiudads);
        expect(comp.ciudadsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const aeropuerto: IAeropuerto = { id: 456 };
        const vuelos: IVuelo = { id: 59839 };
        aeropuerto.vuelos = [vuelos];
        const ciudad: ICiudad = { id: 65139 };
        aeropuerto.ciudad = ciudad;

        activatedRoute.data = of({ aeropuerto });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(aeropuerto));
        expect(comp.vuelosSharedCollection).toContain(vuelos);
        expect(comp.ciudadsSharedCollection).toContain(ciudad);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const aeropuerto = { id: 123 };
        spyOn(aeropuertoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ aeropuerto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: aeropuerto }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(aeropuertoService.update).toHaveBeenCalledWith(aeropuerto);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const aeropuerto = new Aeropuerto();
        spyOn(aeropuertoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ aeropuerto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: aeropuerto }));
        saveSubject.complete();

        // THEN
        expect(aeropuertoService.create).toHaveBeenCalledWith(aeropuerto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const aeropuerto = { id: 123 };
        spyOn(aeropuertoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ aeropuerto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(aeropuertoService.update).toHaveBeenCalledWith(aeropuerto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVueloById', () => {
        it('Should return tracked Vuelo primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVueloById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCiudadById', () => {
        it('Should return tracked Ciudad primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCiudadById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedVuelo', () => {
        it('Should return option if no Vuelo is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedVuelo(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Vuelo for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedVuelo(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Vuelo is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedVuelo(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
