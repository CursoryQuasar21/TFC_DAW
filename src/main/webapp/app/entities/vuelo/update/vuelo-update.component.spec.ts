jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VueloService } from '../service/vuelo.service';
import { IVuelo, Vuelo } from '../vuelo.model';
import { IAvion } from 'app/entities/avion/avion.model';
import { AvionService } from 'app/entities/avion/service/avion.service';

import { VueloUpdateComponent } from './vuelo-update.component';

describe('Component Tests', () => {
  describe('Vuelo Management Update Component', () => {
    let comp: VueloUpdateComponent;
    let fixture: ComponentFixture<VueloUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let vueloService: VueloService;
    let avionService: AvionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VueloUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VueloUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VueloUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      vueloService = TestBed.inject(VueloService);
      avionService = TestBed.inject(AvionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call avion query and add missing value', () => {
        const vuelo: IVuelo = { id: 456 };
        const avion: IAvion = { id: 25103 };
        vuelo.avion = avion;

        const avionCollection: IAvion[] = [{ id: 43633 }];
        spyOn(avionService, 'query').and.returnValue(of(new HttpResponse({ body: avionCollection })));
        const expectedCollection: IAvion[] = [avion, ...avionCollection];
        spyOn(avionService, 'addAvionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ vuelo });
        comp.ngOnInit();

        expect(avionService.query).toHaveBeenCalled();
        expect(avionService.addAvionToCollectionIfMissing).toHaveBeenCalledWith(avionCollection, avion);
        expect(comp.avionsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const vuelo: IVuelo = { id: 456 };
        const avion: IAvion = { id: 65180 };
        vuelo.avion = avion;

        activatedRoute.data = of({ vuelo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vuelo));
        expect(comp.avionsCollection).toContain(avion);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vuelo = { id: 123 };
        spyOn(vueloService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vuelo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vuelo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(vueloService.update).toHaveBeenCalledWith(vuelo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vuelo = new Vuelo();
        spyOn(vueloService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vuelo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vuelo }));
        saveSubject.complete();

        // THEN
        expect(vueloService.create).toHaveBeenCalledWith(vuelo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vuelo = { id: 123 };
        spyOn(vueloService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vuelo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(vueloService.update).toHaveBeenCalledWith(vuelo);
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
