import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IVuelo, Vuelo } from '../vuelo.model';
import { VueloService } from '../service/vuelo.service';
import { IAvion } from 'app/entities/avion/avion.model';
import { AvionService } from 'app/entities/avion/service/avion.service';

@Component({
  selector: 'jhi-vuelo-update',
  templateUrl: './vuelo-update.component.html',
})
export class VueloUpdateComponent implements OnInit {
  isSaving = false;

  avionsCollection: IAvion[] = [];

  editForm = this.fb.group({
    id: [],
    fechaOrigen: [null, [Validators.required]],
    fechaDestino: [null, [Validators.required]],
    precio: [null, [Validators.required, Validators.min(1), Validators.max(99999999)]],
    avion: [],
  });

  constructor(
    protected vueloService: VueloService,
    protected avionService: AvionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vuelo }) => {
      if (vuelo.id === undefined) {
        const today = dayjs().startOf('day');
        vuelo.fechaOrigen = today;
        vuelo.fechaDestino = today;
      }

      this.updateForm(vuelo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vuelo = this.createFromForm();
    if (vuelo.id !== undefined) {
      this.subscribeToSaveResponse(this.vueloService.update(vuelo));
    } else {
      this.subscribeToSaveResponse(this.vueloService.create(vuelo));
    }
  }

  trackAvionById(index: number, item: IAvion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVuelo>>): void {
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

  protected updateForm(vuelo: IVuelo): void {
    this.editForm.patchValue({
      id: vuelo.id,
      fechaOrigen: vuelo.fechaOrigen ? vuelo.fechaOrigen.format(DATE_TIME_FORMAT) : null,
      fechaDestino: vuelo.fechaDestino ? vuelo.fechaDestino.format(DATE_TIME_FORMAT) : null,
      precio: vuelo.precio,
      avion: vuelo.avion,
    });

    this.avionsCollection = this.avionService.addAvionToCollectionIfMissing(this.avionsCollection, vuelo.avion);
  }

  protected loadRelationshipsOptions(): void {
    this.avionService
      .query({ filter: 'vuelo-is-null' })
      .pipe(map((res: HttpResponse<IAvion[]>) => res.body ?? []))
      .pipe(map((avions: IAvion[]) => this.avionService.addAvionToCollectionIfMissing(avions, this.editForm.get('avion')!.value)))
      .subscribe((avions: IAvion[]) => (this.avionsCollection = avions));
  }

  protected createFromForm(): IVuelo {
    return {
      ...new Vuelo(),
      id: this.editForm.get(['id'])!.value,
      fechaOrigen: this.editForm.get(['fechaOrigen'])!.value
        ? dayjs(this.editForm.get(['fechaOrigen'])!.value, DATE_TIME_FORMAT)
        : undefined,
      fechaDestino: this.editForm.get(['fechaDestino'])!.value
        ? dayjs(this.editForm.get(['fechaDestino'])!.value, DATE_TIME_FORMAT)
        : undefined,
      precio: this.editForm.get(['precio'])!.value,
      avion: this.editForm.get(['avion'])!.value,
    };
  }
}
