jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PilotoService } from '../service/piloto.service';
import { IPiloto, Piloto } from '../piloto.model';
import { IAvion } from 'app/entities/avion/avion.model';
import { AvionService } from 'app/entities/avion/service/avion.service';

import { PilotoUpdateComponent } from './piloto-update.component';

describe('Component Tests', () => {
  describe('Piloto Management Update Component', () => {
    let comp: PilotoUpdateComponent;
    let fixture: ComponentFixture<PilotoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pilotoService: PilotoService;
    let avionService: AvionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PilotoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PilotoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PilotoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pilotoService = TestBed.inject(PilotoService);
      avionService = TestBed.inject(AvionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Avion query and add missing value', () => {
        const piloto: IPiloto = { id: 456 };
        const avion: IAvion = { id: 78425 };
        piloto.avion = avion;

        const avionCollection: IAvion[] = [{ id: 34677 }];
        spyOn(avionService, 'query').and.returnValue(of(new HttpResponse({ body: avionCollection })));
        const additionalAvions = [avion];
        const expectedCollection: IAvion[] = [...additionalAvions, ...avionCollection];
        spyOn(avionService, 'addAvionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ piloto });
        comp.ngOnInit();

        expect(avionService.query).toHaveBeenCalled();
        expect(avionService.addAvionToCollectionIfMissing).toHaveBeenCalledWith(avionCollection, ...additionalAvions);
        expect(comp.avionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const piloto: IPiloto = { id: 456 };
        const avion: IAvion = { id: 47001 };
        piloto.avion = avion;

        activatedRoute.data = of({ piloto });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(piloto));
        expect(comp.avionsSharedCollection).toContain(avion);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const piloto = { id: 123 };
        spyOn(pilotoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ piloto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: piloto }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pilotoService.update).toHaveBeenCalledWith(piloto);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const piloto = new Piloto();
        spyOn(pilotoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ piloto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: piloto }));
        saveSubject.complete();

        // THEN
        expect(pilotoService.create).toHaveBeenCalledWith(piloto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const piloto = { id: 123 };
        spyOn(pilotoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ piloto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pilotoService.update).toHaveBeenCalledWith(piloto);
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
