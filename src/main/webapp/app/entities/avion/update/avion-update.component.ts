import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAvion, Avion } from '../avion.model';
import { AvionService } from '../service/avion.service';
import { IModelo } from 'app/entities/modelo/modelo.model';
import { ModeloService } from 'app/entities/modelo/service/modelo.service';
import { IAeropuerto } from 'app/entities/aeropuerto/aeropuerto.model';
import { AeropuertoService } from 'app/entities/aeropuerto/service/aeropuerto.service';

@Component({
  selector: 'jhi-avion-update',
  templateUrl: './avion-update.component.html',
})
export class AvionUpdateComponent implements OnInit {
  isSaving = false;

  modelosSharedCollection: IModelo[] = [];
  aeropuertosSharedCollection: IAeropuerto[] = [];

  editForm = this.fb.group({
    id: [],
    costeFabricacion: [null, [Validators.required, Validators.min(1)]],
    anioFabricacion: [null, [Validators.required]],
    modelo: [],
    aeropuerto: [],
  });

  constructor(
    protected avionService: AvionService,
    protected modeloService: ModeloService,
    protected aeropuertoService: AeropuertoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ avion }) => {
      if (avion.id === undefined) {
        const today = dayjs().startOf('day');
        avion.anioFabricacion = today;
      }

      this.updateForm(avion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const avion = this.createFromForm();
    if (avion.id !== undefined) {
      this.subscribeToSaveResponse(this.avionService.update(avion));
    } else {
      this.subscribeToSaveResponse(this.avionService.create(avion));
    }
  }

  trackModeloById(index: number, item: IModelo): number {
    return item.id!;
  }

  trackAeropuertoById(index: number, item: IAeropuerto): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAvion>>): void {
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

  protected updateForm(avion: IAvion): void {
    this.editForm.patchValue({
      id: avion.id,
      costeFabricacion: avion.costeFabricacion,
      anioFabricacion: avion.anioFabricacion ? avion.anioFabricacion.format(DATE_TIME_FORMAT) : null,
      modelo: avion.modelo,
      aeropuerto: avion.aeropuerto,
    });

    this.modelosSharedCollection = this.modeloService.addModeloToCollectionIfMissing(this.modelosSharedCollection, avion.modelo);
    this.aeropuertosSharedCollection = this.aeropuertoService.addAeropuertoToCollectionIfMissing(
      this.aeropuertosSharedCollection,
      avion.aeropuerto
    );
  }

  protected loadRelationshipsOptions(): void {
    this.modeloService
      .query()
      .pipe(map((res: HttpResponse<IModelo[]>) => res.body ?? []))
      .pipe(map((modelos: IModelo[]) => this.modeloService.addModeloToCollectionIfMissing(modelos, this.editForm.get('modelo')!.value)))
      .subscribe((modelos: IModelo[]) => (this.modelosSharedCollection = modelos));

    this.aeropuertoService
      .query()
      .pipe(map((res: HttpResponse<IAeropuerto[]>) => res.body ?? []))
      .pipe(
        map((aeropuertos: IAeropuerto[]) =>
          this.aeropuertoService.addAeropuertoToCollectionIfMissing(aeropuertos, this.editForm.get('aeropuerto')!.value)
        )
      )
      .subscribe((aeropuertos: IAeropuerto[]) => (this.aeropuertosSharedCollection = aeropuertos));
  }

  protected createFromForm(): IAvion {
    return {
      ...new Avion(),
      id: this.editForm.get(['id'])!.value,
      costeFabricacion: this.editForm.get(['costeFabricacion'])!.value,
      anioFabricacion: this.editForm.get(['anioFabricacion'])!.value
        ? dayjs(this.editForm.get(['anioFabricacion'])!.value, DATE_TIME_FORMAT)
        : undefined,
      modelo: this.editForm.get(['modelo'])!.value,
      aeropuerto: this.editForm.get(['aeropuerto'])!.value,
    };
  }
}
