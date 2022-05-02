import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPais, Pais } from '../pais.model';
import { PaisService } from '../service/pais.service';
import { ICiudad } from 'app/entities/ciudad/ciudad.model';
import { CiudadService } from 'app/entities/ciudad/service/ciudad.service';

@Component({
  selector: 'jhi-pais-update',
  templateUrl: './pais-update.component.html',
})
export class PaisUpdateComponent implements OnInit {
  isSaving = false;

  // ==================================================================================================================================
  // SECCION SWITCH PARA MOSTRAR Y OCULTAR TABLAS DE PERSONAS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Switch que se va a encargar de controlar si el cuerpo de la tabla pilotos se muestra o no
  hiddenCiudades = true;
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION CIUDADES

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar la ciudad
  ciudadesSharedCollection: ICiudad[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar la ciudad seleccionado
  listaCiudadesSeleccionadas: ICiudad[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
  });

  constructor(
    protected paisService: PaisService,
    protected ciudadService: CiudadService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pais }) => {
      this.updateForm(pais);

      // -------------------------------------------------------------------------------------------------------------------------------

      // Metodo que cargan las listas de las zonas
      this.loadListasZonas(pais);

      // -------------------------------------------------------------------------------------------------------------------------------
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pais = this.createFromForm();
    if (pais.id !== undefined) {
      this.subscribeToSaveResponse(this.paisService.update(pais));
    } else {
      this.subscribeToSaveResponse(this.paisService.create(pais));
    }
  }

  // ==================================================================================================================================
  // SECCION DE METODOS PARA MANEJAR LAS LISTAS EN EL HTML

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackCiudadById(index: number, item: ICiudad): number {
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
      case 'cuerpoTablaCiudades': {
        this.hiddenCiudades = !this.hiddenCiudades;
        break;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION CIUDADES

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar Listas de aeropuertos
  public loadListasZonas(pais: IPais): void {
    this.loadCiudades(pais);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar ciudades
  public loadCiudades(pais: IPais): void {
    this.ciudadesSharedCollection = [];
    this.ciudadService.query().subscribe((res: HttpResponse<ICiudad[]>) => {
      res.body?.forEach((ciudad: ICiudad) => {
        // Condicion que determina si la ciudad esta asignado a un pais
        if (ciudad.pais === null) {
          // La ciudad no esta asigando a un pais y por tanto se puede asignar a un pais
          this.ciudadesSharedCollection.push(ciudad);
        } else {
          // Condicion que determina si la ciudad que tiene un pais asignado es el mismo pais que el que se esta mostrando
          if (pais.id === ciudad.pais?.id) {
            this.ciudadesSharedCollection.push(ciudad);
            // Refleja que la ciudad ya esta añadido a la lista de ciudades  ya que se añadio anteriormente en una modificacion anterior del pais
            this.anadirCiudadSeleccionado(ciudad);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que añade una ciudad a la lista de ciudades
  public anadirCiudadSeleccionado(ciudad: ICiudad): void {
    this.listaCiudadesSeleccionadas.push(ciudad);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION PARA ACTUALIZAR LISTAS AEROPUERTOS Y ACTUALIZAR COMPONENTES DEL HTML

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para añadir ciudades a la lista de ciudades seleccionadas y actualizar componentes del html de la tabla de ciudades
  public anadirCiudad(ciudad: ICiudad, e: any): void {
    // Camnbia el tipo de boton segun si el boton esta en añadir o eliminar
    if (e.classList.contains('btn-outline-primary')) {
      // Añade el aeropuerto a la lista de aeropuerto seleccionados
      this.listaCiudadesSeleccionadas.push(ciudad);
      // Reordenacion de la lista de pilotos abordo
      this.listaCiudadesSeleccionadas = this.ordenarListaCiudadesSeleccionada(this.listaCiudadesSeleccionadas);
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-primary');
      e.classList.add('btn-outline-danger');
      e.textContent = 'Eliminar';
    } else {
      //  Recorre la lista identificando, para eliminar el piloto de la lista de pilotos abordo
      for (let i = 0; i < this.listaCiudadesSeleccionadas.length; i++) {
        if (this.listaCiudadesSeleccionadas[i] === ciudad) {
          this.listaCiudadesSeleccionadas.splice(i, 1);
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
  //  Devuelve una lista ordenada de la lista de ciudades seleccionadas
  public ordenarListaCiudadesSeleccionada(ciudades: ICiudad[]): ICiudad[] {
    ciudades.sort(function (a, b) {
      if (a.id && b.id) {
        return a.id - b.id;
      } else {
        return 0;
      }
    });
    return ciudades;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPais>>): void {
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

  protected updateForm(pais: IPais): void {
    this.editForm.patchValue({
      id: pais.id,
      nombre: pais.nombre,
    });
  }

  protected createFromForm(): IPais {
    return {
      ...new Pais(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
    };
  }
}
