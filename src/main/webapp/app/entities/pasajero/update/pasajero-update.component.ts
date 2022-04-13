import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPasajero, Pasajero } from '../pasajero.model';
import { PasajeroService } from '../service/pasajero.service';
import { IAvion } from 'app/entities/avion/avion.model';
import { AvionService } from 'app/entities/avion/service/avion.service';

@Component({
  selector: 'jhi-pasajero-update',
  templateUrl: './pasajero-update.component.html',
})
export class PasajeroUpdateComponent implements OnInit {
  isSaving = false;

  avionsSharedCollection: IAvion[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    apellidos: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    pasaporte: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    cantidadEquipaje: [null, [Validators.required, Validators.min(0), Validators.max(9)]],
    numeroAsiento: [null, [Validators.min(10), Validators.max(853)]],
    avion: [],
  });

  constructor(
    protected pasajeroService: PasajeroService,
    protected avionService: AvionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pasajero }) => {
      this.updateForm(pasajero);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pasajero = this.createFromForm();
    if (pasajero.id !== undefined) {
      this.subscribeToSaveResponse(this.pasajeroService.update(pasajero));
    } else {
      this.subscribeToSaveResponse(this.pasajeroService.create(pasajero));
    }
  }

  trackAvionById(index: number, item: IAvion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPasajero>>): void {
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

  protected updateForm(pasajero: IPasajero): void {
    this.editForm.patchValue({
      id: pasajero.id,
      nombre: pasajero.nombre,
      apellidos: pasajero.apellidos,
      pasaporte: pasajero.pasaporte,
      cantidadEquipaje: pasajero.cantidadEquipaje,
      numeroAsiento: pasajero.numeroAsiento,
      avion: pasajero.avion,
    });

    this.avionsSharedCollection = this.avionService.addAvionToCollectionIfMissing(this.avionsSharedCollection, pasajero.avion);
  }

  protected loadRelationshipsOptions(): void {
    this.avionService
      .query()
      .pipe(map((res: HttpResponse<IAvion[]>) => res.body ?? []))
      .pipe(map((avions: IAvion[]) => this.avionService.addAvionToCollectionIfMissing(avions, this.editForm.get('avion')!.value)))
      .subscribe((avions: IAvion[]) => (this.avionsSharedCollection = avions));
  }

  protected createFromForm(): IPasajero {
    return {
      ...new Pasajero(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellidos: this.editForm.get(['apellidos'])!.value,
      pasaporte: this.editForm.get(['pasaporte'])!.value,
      cantidadEquipaje: this.editForm.get(['cantidadEquipaje'])!.value,
      numeroAsiento: this.editForm.get(['numeroAsiento'])!.value,
      avion: this.editForm.get(['avion'])!.value,
    };
  }
}
