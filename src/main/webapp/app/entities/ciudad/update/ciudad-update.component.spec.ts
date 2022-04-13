jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CiudadService } from '../service/ciudad.service';
import { ICiudad, Ciudad } from '../ciudad.model';
import { IPais } from 'app/entities/pais/pais.model';
import { PaisService } from 'app/entities/pais/service/pais.service';

import { CiudadUpdateComponent } from './ciudad-update.component';

describe('Component Tests', () => {
  describe('Ciudad Management Update Component', () => {
    let comp: CiudadUpdateComponent;
    let fixture: ComponentFixture<CiudadUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ciudadService: CiudadService;
    let paisService: PaisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CiudadUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CiudadUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CiudadUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ciudadService = TestBed.inject(CiudadService);
      paisService = TestBed.inject(PaisService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Pais query and add missing value', () => {
        const ciudad: ICiudad = { id: 456 };
        const pais: IPais = { id: 32003 };
        ciudad.pais = pais;

        const paisCollection: IPais[] = [{ id: 49901 }];
        spyOn(paisService, 'query').and.returnValue(of(new HttpResponse({ body: paisCollection })));
        const additionalPais = [pais];
        const expectedCollection: IPais[] = [...additionalPais, ...paisCollection];
        spyOn(paisService, 'addPaisToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ ciudad });
        comp.ngOnInit();

        expect(paisService.query).toHaveBeenCalled();
        expect(paisService.addPaisToCollectionIfMissing).toHaveBeenCalledWith(paisCollection, ...additionalPais);
        expect(comp.paisSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const ciudad: ICiudad = { id: 456 };
        const pais: IPais = { id: 10656 };
        ciudad.pais = pais;

        activatedRoute.data = of({ ciudad });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ciudad));
        expect(comp.paisSharedCollection).toContain(pais);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ciudad = { id: 123 };
        spyOn(ciudadService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ciudad });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ciudad }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ciudadService.update).toHaveBeenCalledWith(ciudad);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ciudad = new Ciudad();
        spyOn(ciudadService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ciudad });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ciudad }));
        saveSubject.complete();

        // THEN
        expect(ciudadService.create).toHaveBeenCalledWith(ciudad);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ciudad = { id: 123 };
        spyOn(ciudadService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ciudad });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ciudadService.update).toHaveBeenCalledWith(ciudad);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPaisById', () => {
        it('Should return tracked Pais primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPaisById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
