import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITripulante, Tripulante } from '../tripulante.model';
import { TripulanteService } from '../service/tripulante.service';
import { IAvion } from 'app/entities/avion/avion.model';
import { AvionService } from 'app/entities/avion/service/avion.service';

@Component({
  selector: 'jhi-tripulante-update',
  templateUrl: './tripulante-update.component.html',
})
export class TripulanteUpdateComponent implements OnInit {
  isSaving = false;

  // ==================================================================================================================================
  // SECCION VERIFICADOR

  // -------------------------------------------------------------------------------------------------------------------------------
  // Variable encargada de verificar si el avion seleccionado tiene hueco o no
  isAvion = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  avionsSharedCollection: IAvion[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    apellidos: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    pasaporte: [
      null,
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern('[A-Z]{1}[0-9]{8}|[A-Z]{1}[0-9]{7}[A-Z]{1}'),
      ],
    ],
    avion: [],
  });

  constructor(
    protected tripulanteService: TripulanteService,
    protected avionService: AvionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tripulante }) => {
      this.updateForm(tripulante);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tripulante = this.createFromForm();
    if (tripulante.id !== undefined) {
      this.subscribeToSaveResponse(this.tripulanteService.update(tripulante));
    } else {
      this.subscribeToSaveResponse(this.tripulanteService.create(tripulante));
    }
  }

  trackAvionById(index: number, item: IAvion): number {
    return item.id!;
  }

  // ==================================================================================================================================
  // SECCION VERIFICAR AVION

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo encargado de verificar si el avion seleccionado tiene la capacidad para albergar a este tripulante
  public verificarCantidadTripulantes(e: any): void {
    // Condicion que determina si el campo del avion esta o no definido y tiene algun valor
    if (this.editForm.get(['avion'])?.value !== null && this.editForm.get(['avion'])?.value !== undefined) {
      // Condicion que determina si el avion seleccionado posee o no un modelo
      if (this.editForm.get(['avion'])?.value.modelo !== null && this.editForm.get(['avion'])?.value.modelo !== undefined) {
        // Condicion que determina si la capacidad de tripulantes en el avion es 0 y siendo asi, la imposibilidad de agregar el tripulante
        if (this.editForm.get(['avion'])?.value.modelo.cantidadTripulante === 0) {
          this.isAvion = true;
        } else {
          // Condicion que determina si hay tripulantes ya agregados al avion y de no haberlos es seguro que habra plazas para el tripulante
          if (
            this.editForm.get(['avion'])?.value.modelo.tripulantes !== null &&
            this.editForm.get(['avion'])?.value.modelo.tripulantes !== undefined
          ) {
            // Condicion que determina si la capacidad de tripulantes y el numero de ellos es igual y de ser asi, la imposibilidad de agregar el tripulante
            if (this.editForm.get(['avion'])?.value.tripulantes?.length === this.editForm.get(['avion'])?.value.modelo.cantidadTripulante) {
              this.isAvion = true;
            } else {
              this.isAvion = false;
            }
          } else {
            this.isAvion = false;
          }
        }
      } else {
        this.isAvion = true;
      }
    } else {
      this.isAvion = false;
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITripulante>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(tripulante: ITripulante): void {
    this.editForm.patchValue({
      id: tripulante.id,
      nombre: tripulante.nombre,
      apellidos: tripulante.apellidos,
      pasaporte: tripulante.pasaporte,
      avion: tripulante.avion,
    });

    this.avionsSharedCollection = this.avionService.addAvionToCollectionIfMissing(this.avionsSharedCollection, tripulante.avion);
  }

  protected loadRelationshipsOptions(): void {
    this.avionService
      .query()
      .pipe(map((res: HttpResponse<IAvion[]>) => res.body ?? []))
      .pipe(map((avions: IAvion[]) => this.avionService.addAvionToCollectionIfMissing(avions, this.editForm.get('avion')!.value)))
      .subscribe((avions: IAvion[]) => (this.avionsSharedCollection = avions));
  }

  protected createFromForm(): ITripulante {
    return {
      ...new Tripulante(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellidos: this.editForm.get(['apellidos'])!.value,
      pasaporte: this.editForm.get(['pasaporte'])!.value,
      avion: this.editForm.get(['avion'])!.value,
    };
  }
}
