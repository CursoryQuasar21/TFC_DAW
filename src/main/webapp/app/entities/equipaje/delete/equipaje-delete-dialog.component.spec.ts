jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EquipajeService } from '../service/equipaje.service';

import { EquipajeDeleteDialogComponent } from './equipaje-delete-dialog.component';

describe('Component Tests', () => {
  describe('Equipaje Management Delete Component', () => {
    let comp: EquipajeDeleteDialogComponent;
    let fixture: ComponentFixture<EquipajeDeleteDialogComponent>;
    let service: EquipajeService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EquipajeDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(EquipajeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EquipajeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EquipajeService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
