import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAeropuerto, Aeropuerto } from '../aeropuerto.model';
import { AeropuertoService } from '../service/aeropuerto.service';
import { IVuelo } from 'app/entities/vuelo/vuelo.model';
import { VueloService } from 'app/entities/vuelo/service/vuelo.service';
import { ICiudad } from 'app/entities/ciudad/ciudad.model';
import { CiudadService } from 'app/entities/ciudad/service/ciudad.service';

@Component({
  selector: 'jhi-aeropuerto-update',
  templateUrl: './aeropuerto-update.component.html',
})
export class AeropuertoUpdateComponent implements OnInit {
  isSaving = false;

  vuelosSharedCollection: IVuelo[] = [];
  ciudadsSharedCollection: ICiudad[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    vuelos: [],
    ciudad: [],
  });

  constructor(
    protected aeropuertoService: AeropuertoService,
    protected vueloService: VueloService,
    protected ciudadService: CiudadService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aeropuerto }) => {
      this.updateForm(aeropuerto);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const aeropuerto = this.createFromForm();
    if (aeropuerto.id !== undefined) {
      this.subscribeToSaveResponse(this.aeropuertoService.update(aeropuerto));
    } else {
      this.subscribeToSaveResponse(this.aeropuertoService.create(aeropuerto));
    }
  }

  trackVueloById(index: number, item: IVuelo): number {
    return item.id!;
  }

  trackCiudadById(index: number, item: ICiudad): number {
    return item.id!;
  }

  getSelectedVuelo(option: IVuelo, selectedVals?: IVuelo[]): IVuelo {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAeropuerto>>): void {
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

  protected updateForm(aeropuerto: IAeropuerto): void {
    this.editForm.patchValue({
      id: aeropuerto.id,
      nombre: aeropuerto.nombre,
      vuelos: aeropuerto.vuelos,
      ciudad: aeropuerto.ciudad,
    });

    this.vuelosSharedCollection = this.vueloService.addVueloToCollectionIfMissing(
      this.vuelosSharedCollection,
      ...(aeropuerto.vuelos ?? [])
    );
    this.ciudadsSharedCollection = this.ciudadService.addCiudadToCollectionIfMissing(this.ciudadsSharedCollection, aeropuerto.ciudad);
  }

  protected loadRelationshipsOptions(): void {
    this.vueloService
      .query()
      .pipe(map((res: HttpResponse<IVuelo[]>) => res.body ?? []))
      .pipe(
        map((vuelos: IVuelo[]) => this.vueloService.addVueloToCollectionIfMissing(vuelos, ...(this.editForm.get('vuelos')!.value ?? [])))
      )
      .subscribe((vuelos: IVuelo[]) => (this.vuelosSharedCollection = vuelos));

    this.ciudadService
      .query()
      .pipe(map((res: HttpResponse<ICiudad[]>) => res.body ?? []))
      .pipe(map((ciudads: ICiudad[]) => this.ciudadService.addCiudadToCollectionIfMissing(ciudads, this.editForm.get('ciudad')!.value)))
      .subscribe((ciudads: ICiudad[]) => (this.ciudadsSharedCollection = ciudads));
  }

  protected createFromForm(): IAeropuerto {
    return {
      ...new Aeropuerto(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      vuelos: this.editForm.get(['vuelos'])!.value,
      ciudad: this.editForm.get(['ciudad'])!.value,
    };
  }
}
