jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ModeloService } from '../service/modelo.service';
import { IModelo, Modelo } from '../modelo.model';

import { ModeloUpdateComponent } from './modelo-update.component';

describe('Component Tests', () => {
  describe('Modelo Management Update Component', () => {
    let comp: ModeloUpdateComponent;
    let fixture: ComponentFixture<ModeloUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let modeloService: ModeloService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ModeloUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ModeloUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ModeloUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      modeloService = TestBed.inject(ModeloService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const modelo: IModelo = { id: 456 };

        activatedRoute.data = of({ modelo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(modelo));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const modelo = { id: 123 };
        spyOn(modeloService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ modelo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: modelo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(modeloService.update).toHaveBeenCalledWith(modelo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const modelo = new Modelo();
        spyOn(modeloService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ modelo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: modelo }));
        saveSubject.complete();

        // THEN
        expect(modeloService.create).toHaveBeenCalledWith(modelo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const modelo = { id: 123 };
        spyOn(modeloService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ modelo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(modeloService.update).toHaveBeenCalledWith(modelo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
