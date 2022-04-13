jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AvionService } from '../service/avion.service';
import { IAvion, Avion } from '../avion.model';
import { IModelo } from 'app/entities/modelo/modelo.model';
import { ModeloService } from 'app/entities/modelo/service/modelo.service';
import { IAeropuerto } from 'app/entities/aeropuerto/aeropuerto.model';
import { AeropuertoService } from 'app/entities/aeropuerto/service/aeropuerto.service';

import { AvionUpdateComponent } from './avion-update.component';

describe('Component Tests', () => {
  describe('Avion Management Update Component', () => {
    let comp: AvionUpdateComponent;
    let fixture: ComponentFixture<AvionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let avionService: AvionService;
    let modeloService: ModeloService;
    let aeropuertoService: AeropuertoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AvionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AvionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AvionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      avionService = TestBed.inject(AvionService);
      modeloService = TestBed.inject(ModeloService);
      aeropuertoService = TestBed.inject(AeropuertoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Modelo query and add missing value', () => {
        const avion: IAvion = { id: 456 };
        const modelo: IModelo = { id: 86142 };
        avion.modelo = modelo;

        const modeloCollection: IModelo[] = [{ id: 32830 }];
        spyOn(modeloService, 'query').and.returnValue(of(new HttpResponse({ body: modeloCollection })));
        const additionalModelos = [modelo];
        const expectedCollection: IModelo[] = [...additionalModelos, ...modeloCollection];
        spyOn(modeloService, 'addModeloToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ avion });
        comp.ngOnInit();

        expect(modeloService.query).toHaveBeenCalled();
        expect(modeloService.addModeloToCollectionIfMissing).toHaveBeenCalledWith(modeloCollection, ...additionalModelos);
        expect(comp.modelosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Aeropuerto query and add missing value', () => {
        const avion: IAvion = { id: 456 };
        const aeropuerto: IAeropuerto = { id: 52553 };
        avion.aeropuerto = aeropuerto;

        const aeropuertoCollection: IAeropuerto[] = [{ id: 79420 }];
        spyOn(aeropuertoService, 'query').and.returnValue(of(new HttpResponse({ body: aeropuertoCollection })));
        const additionalAeropuertos = [aeropuerto];
        const expectedCollection: IAeropuerto[] = [...additionalAeropuertos, ...aeropuertoCollection];
        spyOn(aeropuertoService, 'addAeropuertoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ avion });
        comp.ngOnInit();

        expect(aeropuertoService.query).toHaveBeenCalled();
        expect(aeropuertoService.addAeropuertoToCollectionIfMissing).toHaveBeenCalledWith(aeropuertoCollection, ...additionalAeropuertos);
        expect(comp.aeropuertosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const avion: IAvion = { id: 456 };
        const modelo: IModelo = { id: 38060 };
        avion.modelo = modelo;
        const aeropuerto: IAeropuerto = { id: 49393 };
        avion.aeropuerto = aeropuerto;

        activatedRoute.data = of({ avion });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(avion));
        expect(comp.modelosSharedCollection).toContain(modelo);
        expect(comp.aeropuertosSharedCollection).toContain(aeropuerto);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avion = { id: 123 };
        spyOn(avionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: avion }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(avionService.update).toHaveBeenCalledWith(avion);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avion = new Avion();
        spyOn(avionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: avion }));
        saveSubject.complete();

        // THEN
        expect(avionService.create).toHaveBeenCalledWith(avion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avion = { id: 123 };
        spyOn(avionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(avionService.update).toHaveBeenCalledWith(avion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackModeloById', () => {
        it('Should return tracked Modelo primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackModeloById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackAeropuertoById', () => {
        it('Should return tracked Aeropuerto primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAeropuertoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
