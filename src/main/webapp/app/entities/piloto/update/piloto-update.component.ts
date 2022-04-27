import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPiloto, Piloto } from '../piloto.model';
import { PilotoService } from '../service/piloto.service';
import { IAvion } from 'app/entities/avion/avion.model';
import { AvionService } from 'app/entities/avion/service/avion.service';

@Component({
  selector: 'jhi-piloto-update',
  templateUrl: './piloto-update.component.html',
})
export class PilotoUpdateComponent implements OnInit {
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
    protected pilotoService: PilotoService,
    protected avionService: AvionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ piloto }) => {
      this.updateForm(piloto);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const piloto = this.createFromForm();
    if (piloto.id !== undefined) {
      this.subscribeToSaveResponse(this.pilotoService.update(piloto));
    } else {
      this.subscribeToSaveResponse(this.pilotoService.create(piloto));
    }
  }

  trackAvionById(index: number, item: IAvion): number {
    return item.id!;
  }

  // ==================================================================================================================================
  // SECCION VERIFICAR AVION

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo encargado de verificar si el avion seleccionado tiene la capacidad para albergar a este piloto
  public verificarCantidadPilotos(e: any): void {
    // Condicion que determina si el campo del avion esta o no definido y tiene algun valor
    if (this.editForm.get(['avion'])?.value !== null && this.editForm.get(['avion'])?.value !== undefined) {
      // Condicion que determina si el avion seleccionado posee o no un modelo
      if (this.editForm.get(['avion'])?.value.modelo !== null && this.editForm.get(['avion'])?.value.modelo !== undefined) {
        // Condicion que determina si la capacidad de pilotos en el avion es 0 y siendo asi, la imposibilidad de agregar el piloto
        if (this.editForm.get(['avion'])?.value.modelo.cantidadPiloto === 0) {
          this.isAvion = true;
        } else {
          // Condicion que determina si hay pilotos ya agregados al avion y de no haberlos es seguro que habra plazas para el piloto
          if (
            this.editForm.get(['avion'])?.value.modelo.pilotos !== null &&
            this.editForm.get(['avion'])?.value.modelo.pilotos !== undefined
          ) {
            // Condicion que determina si la capacidad de pilotos y el numero de ellos es igual y de ser asi, la imposibilidad de agregar el piloto
            if (this.editForm.get(['avion'])?.value.pilotos?.length === this.editForm.get(['avion'])?.value.modelo.cantidadPiloto) {
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPiloto>>): void {
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

  protected updateForm(piloto: IPiloto): void {
    this.editForm.patchValue({
      id: piloto.id,
      nombre: piloto.nombre,
      apellidos: piloto.apellidos,
      pasaporte: piloto.pasaporte,
      avion: piloto.avion,
    });

    this.avionsSharedCollection = this.avionService.addAvionToCollectionIfMissing(this.avionsSharedCollection, piloto.avion);
  }

  protected loadRelationshipsOptions(): void {
    this.avionService
      .query()
      .pipe(map((res: HttpResponse<IAvion[]>) => res.body ?? []))
      .pipe(map((avions: IAvion[]) => this.avionService.addAvionToCollectionIfMissing(avions, this.editForm.get('avion')!.value)))
      .subscribe((avions: IAvion[]) => (this.avionsSharedCollection = avions));
  }

  protected createFromForm(): IPiloto {
    return {
      ...new Piloto(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellidos: this.editForm.get(['apellidos'])!.value,
      pasaporte: this.editForm.get(['pasaporte'])!.value,
      avion: this.editForm.get(['avion'])!.value,
    };
  }
}
