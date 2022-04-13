import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IModelo, Modelo } from '../modelo.model';
import { ModeloService } from '../service/modelo.service';

@Component({
  selector: 'jhi-modelo-update',
  templateUrl: './modelo-update.component.html',
})
export class ModeloUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
    motores: [null, [Validators.required, Validators.min(1), Validators.max(9)]],
    cantidadPilotos: [null, [Validators.required, Validators.min(1), Validators.max(4)]],
    cantidadTripulantes: [null, [Validators.required, Validators.min(1), Validators.max(9)]],
    cantidadPasajeros: [null, [Validators.required, Validators.min(1), Validators.max(853)]],
    cantidadEquipajes: [null, [Validators.required, Validators.min(0), Validators.max(999)]],
  });

  constructor(protected modeloService: ModeloService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ modelo }) => {
      this.updateForm(modelo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const modelo = this.createFromForm();
    if (modelo.id !== undefined) {
      this.subscribeToSaveResponse(this.modeloService.update(modelo));
    } else {
      this.subscribeToSaveResponse(this.modeloService.create(modelo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IModelo>>): void {
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

  protected updateForm(modelo: IModelo): void {
    this.editForm.patchValue({
      id: modelo.id,
      nombre: modelo.nombre,
      motores: modelo.motores,
      cantidadPilotos: modelo.cantidadPilotos,
      cantidadTripulantes: modelo.cantidadTripulantes,
      cantidadPasajeros: modelo.cantidadPasajeros,
      cantidadEquipajes: modelo.cantidadEquipajes,
    });
  }

  protected createFromForm(): IModelo {
    return {
      ...new Modelo(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      motores: this.editForm.get(['motores'])!.value,
      cantidadPilotos: this.editForm.get(['cantidadPilotos'])!.value,
      cantidadTripulantes: this.editForm.get(['cantidadTripulantes'])!.value,
      cantidadPasajeros: this.editForm.get(['cantidadPasajeros'])!.value,
      cantidadEquipajes: this.editForm.get(['cantidadEquipajes'])!.value,
    };
  }
}
