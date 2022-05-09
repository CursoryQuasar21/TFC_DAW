import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICiudad, Ciudad } from '../ciudad.model';
import { CiudadService } from '../service/ciudad.service';
import { IPais } from 'app/entities/pais/pais.model';
import { PaisService } from 'app/entities/pais/service/pais.service';
import { IAeropuerto } from 'app/entities/aeropuerto/aeropuerto.model';
import { AeropuertoService } from 'app/entities/aeropuerto/service/aeropuerto.service';

@Component({
  selector: 'jhi-ciudad-update',
  templateUrl: './ciudad-update.component.html',
})
export class CiudadUpdateComponent implements OnInit {
  isSaving = false;

  // ==================================================================================================================================
  // SECCION SWITCH PARA MOSTRAR Y OCULTAR TABLAS DE PERSONAS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Switch que se va a encargar de controlar si el cuerpo de la tabla pilotos se muestra o no
  hiddenAeropuertos = true;
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION AEROPUERTO

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el aeropuerto
  aeropuertosSharedCollection: IAeropuerto[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el aeropuerto seleccionado
  listaAeropuertosSeleccionados: IAeropuerto[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  paisSharedCollection: IPais[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    pais: [],
    aeropuertos: [],
  });

  constructor(
    protected aeropuertoService: AeropuertoService,
    protected ciudadService: CiudadService,
    protected paisService: PaisService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ciudad }) => {
      console.log('antes');
      console.log(ciudad);
      this.updateForm(ciudad);
      console.log('despues');
      console.log(ciudad);
      this.loadRelationshipsOptions();

      // -------------------------------------------------------------------------------------------------------------------------------

      // Metodo que cargan las listas de las zonas
      this.loadListasZonas(ciudad);

      // -------------------------------------------------------------------------------------------------------------------------------
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ciudad = this.createFromForm();
    if (ciudad.id !== undefined) {
      this.subscribeToSaveResponse(this.ciudadService.update(ciudad));
    } else {
      this.subscribeToSaveResponse(this.ciudadService.create(ciudad));
    }
  }

  // ==================================================================================================================================
  // SECCION DE METODOS PARA MANEJAR LAS LISTAS EN EL HTML

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackAeropuertoById(index: number, item: IAeropuerto): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackPaisById(index: number, item: IPais): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION MOSTRAR OCULTAR TABLAS DE PERSONAS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo agregado
  // Metodo encargado de mostrar y ocultar la tabla indicada por parametro
  public mostrarOcultarTabla(i: number, e: any): void {
    const elemento = document.getElementsByClassName('custom-control-label')[i];
    if (elemento.innerHTML === 'Ocultar') {
      elemento.innerHTML = 'Mostrar';
    } else {
      elemento.innerHTML = 'Ocultar';
    }
    switch (e) {
      case 'cuerpoTablaAeropuertos': {
        this.hiddenAeropuertos = !this.hiddenAeropuertos;
        break;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION AEROPUERTOS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar Listas de aeropuertos
  public loadListasZonas(ciudad: ICiudad): void {
    this.loadAeropuertos(ciudad);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar aeropuertos
  public loadAeropuertos(ciudad: ICiudad): void {
    this.aeropuertosSharedCollection = [];
    this.aeropuertoService.query().subscribe((res: HttpResponse<IAeropuerto[]>) => {
      res.body?.forEach((aeropuerto: IAeropuerto) => {
        // Condicion que determina si el aeropuerto esta asignado a una ciudad
        if (aeropuerto.ciudad === null) {
          // El aeropuerto no esta asigando a una ciudad y por tanto se puede asignar a una ciudad
          this.aeropuertosSharedCollection.push(aeropuerto);
        } else {
          // Condicion que determina si el aeropuerto que tiene una ciudad asignada es la misma ciudad que la que se esta mostrando
          if (ciudad.id === aeropuerto.ciudad?.id) {
            this.aeropuertosSharedCollection.push(aeropuerto);
            // Refleja que el aeropuerto ya esta añadido a la lista de aeropuerto ya que se añadio anteriormente en una modificacion anterior de la ciudad
            this.anadirAeropuertoSeleccionado(aeropuerto);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que añade un aeropuerto a la lista de aeropuertos
  public anadirAeropuertoSeleccionado(aeropuerto: IAeropuerto): void {
    this.listaAeropuertosSeleccionados.push(aeropuerto);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION PARA ACTUALIZAR LISTAS AEROPUERTOS Y ACTUALIZAR COMPONENTES DEL HTML

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para añadir aeropuertos a la lista de aeropuertos seleccionados y actualizar componentes del html de la tabla de aeropuertos
  public anadirAeropuerto(aeropuerto: IAeropuerto, e: any): void {
    // Camnbia el tipo de boton segun si el boton esta en añadir o eliminar
    if (e.classList.contains('btn-outline-primary')) {
      // Añade el aeropuerto a la lista de aeropuerto seleccionados
      this.listaAeropuertosSeleccionados.push(aeropuerto);
      // Reordenacion de la lista de pilotos abordo
      this.listaAeropuertosSeleccionados = this.ordenarListaAeropuertosSeleccionada(this.listaAeropuertosSeleccionados);
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-primary');
      e.classList.add('btn-outline-danger');
      e.textContent = 'Eliminar';
    } else {
      //  Recorre la lista identificando, para eliminar el piloto de la lista de pilotos abordo
      for (let i = 0; i < this.listaAeropuertosSeleccionados.length; i++) {
        if (this.listaAeropuertosSeleccionados[i] === aeropuerto) {
          this.listaAeropuertosSeleccionados.splice(i, 1);
        }
      }
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-danger');
      e.classList.add('btn-outline-primary');
      e.textContent = 'Añadir';
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  //  Metodo agregado
  //  Devuelve una lista ordenada de la lista de aeropuertos seleccionada
  public ordenarListaAeropuertosSeleccionada(aeropuertos: IAeropuerto[]): IAeropuerto[] {
    aeropuertos.sort(function (a, b) {
      if (a.id && b.id) {
        return a.id - b.id;
      } else {
        return 0;
      }
    });
    return aeropuertos;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICiudad>>): void {
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

  protected updateForm(ciudad: ICiudad): void {
    this.editForm.patchValue({
      id: ciudad.id,
      nombre: ciudad.nombre,
      pais: ciudad.pais,
      aeropuertos: ciudad.aeropuertos,
    });

    this.paisSharedCollection = this.paisService.addPaisToCollectionIfMissing(this.paisSharedCollection, ciudad.pais);
  }

  protected loadRelationshipsOptions(): void {
    this.paisService
      .query()
      .pipe(map((res: HttpResponse<IPais[]>) => res.body ?? []))
      .pipe(map((pais: IPais[]) => this.paisService.addPaisToCollectionIfMissing(pais, this.editForm.get('pais')!.value)))
      .subscribe((pais: IPais[]) => (this.paisSharedCollection = pais));
  }

  protected createFromForm(): ICiudad {
    return {
      ...new Ciudad(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      pais: this.editForm.get(['pais'])!.value,
      aeropuertos: this.listaAeropuertosSeleccionados,
    };
  }
}
