import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEquipaje, Equipaje } from '../equipaje.model';
import { EquipajeService } from '../service/equipaje.service';
import { IPasajero } from 'app/entities/pasajero/pasajero.model';
import { PasajeroService } from 'app/entities/pasajero/service/pasajero.service';

@Component({
  selector: 'jhi-equipaje-update',
  templateUrl: './equipaje-update.component.html',
})
export class EquipajeUpdateComponent implements OnInit {
  isSaving = false;

  // ==================================================================================================================================
  // SECCION VERIFICADOR

  // -------------------------------------------------------------------------------------------------------------------------------
  // Variable encargada de verificar si el equipaje seleccionado tiene la posibiidad de asignarse al pasajero seleccionado
  isEquipaje = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  cantidadRealEquipaje = 0;
  pasajerosSharedCollection: IPasajero[] = [];

  editForm = this.fb.group({
    id: [],
    tipo: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    pasajero: [],
  });

  constructor(
    protected equipajeService: EquipajeService,
    protected pasajeroService: PasajeroService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipaje }) => {
      this.updateForm(equipaje);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const equipaje = this.createFromForm();
    if (equipaje.id !== undefined) {
      this.subscribeToSaveResponse(this.equipajeService.update(equipaje));
    } else {
      this.subscribeToSaveResponse(this.equipajeService.create(equipaje));
    }
  }

  trackPasajeroById(index: number, item: IPasajero): number {
    return item.id!;
  }

  // ==================================================================================================================================
  // SECCION VERIFICADOR

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo encargado de verificar si el pasajero seleccionado tiene la posibilidad de poder ser asignado nuevos equipajes, como este
  public verificarCantidadEquipaje(e: any): void {
    if (this.editForm.get(['pasajero'])?.value !== null && this.editForm.get(['pasajero'])?.value !== undefined) {
      if (this.editForm.get(['pasajero'])?.value.cantidadEquipaje === 0) {
        this.isEquipaje = true;
      } else {
        this.setCantidadRealEquipajes();
      }
    } else {
      this.isEquipaje = false;
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para calcular la cantidad real de quipajes
  public setCantidadRealEquipajes(): void {
    this.cantidadRealEquipaje = 0;
    this.pasajeroService.query().subscribe((res: HttpResponse<IPasajero[]>) => {
      res.body?.forEach((pasajero: IPasajero) => {
        if (this.editForm.get(['pasajero'])?.value.id === pasajero.id) {
          this.equipajeService.query().subscribe((res2: HttpResponse<IEquipaje[]>) => {
            res2.body?.forEach((equipaje: IEquipaje) => {
              if (equipaje.pasajero?.id === pasajero.id && this.editForm.get(['id'])?.value !== equipaje.id) {
                this.cantidadRealEquipaje++;
              }
            });
            if (this.cantidadRealEquipaje === this.editForm.get(['pasajero'])?.value.cantidadEquipaje) {
              this.isEquipaje = true;
            } else {
              this.isEquipaje = false;
            }
          });
        }
      });
    });
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEquipaje>>): void {
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

  protected updateForm(equipaje: IEquipaje): void {
    this.editForm.patchValue({
      id: equipaje.id,
      tipo: equipaje.tipo,
      pasajero: equipaje.pasajero,
    });

    this.pasajerosSharedCollection = this.pasajeroService.addPasajeroToCollectionIfMissing(
      this.pasajerosSharedCollection,
      equipaje.pasajero
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pasajeroService
      .query()
      .pipe(map((res: HttpResponse<IPasajero[]>) => res.body ?? []))
      .pipe(
        map((pasajeros: IPasajero[]) =>
          this.pasajeroService.addPasajeroToCollectionIfMissing(pasajeros, this.editForm.get('pasajero')!.value)
        )
      )
      .subscribe((pasajeros: IPasajero[]) => (this.pasajerosSharedCollection = pasajeros));
  }

  protected createFromForm(): IEquipaje {
    return {
      ...new Equipaje(),
      id: this.editForm.get(['id'])!.value,
      tipo: this.editForm.get(['tipo'])!.value,
      pasajero: this.editForm.get(['pasajero'])!.value,
    };
  }
}
