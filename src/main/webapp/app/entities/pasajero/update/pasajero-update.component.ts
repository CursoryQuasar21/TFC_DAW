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
import { IEquipaje } from 'app/entities/equipaje/equipaje.model';
import { EquipajeService } from 'app/entities/equipaje/service/equipaje.service';

@Component({
  selector: 'jhi-pasajero-update',
  templateUrl: './pasajero-update.component.html',
})
export class PasajeroUpdateComponent implements OnInit {
  isSaving = false;

  // ==================================================================================================================================
  // SECCION VERIFICADOR

  // -------------------------------------------------------------------------------------------------------------------------------
  // Variable encargada de verificar si el avion seleccionado tiene hueco o no
  isAvion = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Variable encargada de verificar si el pasajero seleccionado tiene todos los equipajes o no
  isNumeroE = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Variable encargada de verificar si el avion seleccionado posee asietos disponibles segun su modelo
  isNumeroA = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Variable encargada de verificar si el asiento seleccionado del avion seleccionado esta disponible y no se repite
  isNumeroAExiste = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  hiddenEquipajes = true;
  pasajero: any;
  cantidadRealPasajero = 0;

  avionsSharedCollection: IAvion[] = [];

  equipajesSharedCollection: IEquipaje[] = [];
  listaEquipajeP: IEquipaje[] = [];

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
        Validators.pattern('[0-9]{8}[A-Z]{1}|[A-Z]{1}[0-9]{7}[A-Z]{1}'),
      ],
    ],
    cantidadEquipaje: [null, [Validators.required, Validators.min(0), Validators.max(9)]],
    numeroAsiento: [null, [Validators.min(10), Validators.max(853)]],
    avion: [],
  });

  constructor(
    protected pasajeroService: PasajeroService,
    protected avionService: AvionService,
    protected equipajeService: EquipajeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pasajero }) => {
      this.updateForm(pasajero);

      this.loadRelationshipsOptions();

      this.loadEquipajes(pasajero);
      this.pasajero = pasajero;
    });
  }
  verificador(): boolean {
    return false;
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

  // ==================================================================================================================================
  // SECCION DE METODOS PARA MANEJAR LAS LISTAS EN EL HTML

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackAvionById(index: number, item: IAvion): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackEquipajeById(index: number, item: IEquipaje): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION ASIENTO

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para gestionar el numero de asiento en funcion del input en el caso de que el valor sea 0
  public billete(): void {
    this.editForm.patchValue({
      numeroAsiento: null,
    });
    this.verificarAsiento();
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para gestionar las verificaciones necesarioas para el control de asignacion de control numeroAsiento
  public verificarAsiento(): void {
    // Condicion que determina si el campo del avion esta o no definido y tiene algun valor
    if (this.editForm.get(['avion'])?.value !== null && this.editForm.get(['avion'])?.value !== undefined) {
      // Condicion que determina si el avion seleccionado posee o no un modelo
      if (this.editForm.get(['avion'])?.value.modelo !== null && this.editForm.get(['avion'])?.value.modelo !== undefined) {
        // Condicion que determina si la capacidad de pasajeros en el avion es 0 y siendo asi, la imposibilidad de agregar el pasajero
        if (this.editForm.get(['avion'])?.value.modelo.cantidadPasajeros === 0) {
          console.log('0');
          this.isNumeroA = true;
        } else {
          // Condicion que determina si hay pasajeros ya agregados al avion y de no haberlos es seguro que habra plazas para el pasajero
          this.setCantidadRealPasajeros();
        }
      } else {
        console.log('1');
        this.isNumeroA = true;
      }
    } else {
      if (this.editForm.get(['numeroAsiento'])?.value === null) {
        console.log('2');
        this.isNumeroA = false;
      } else {
        console.log('3');
        this.isNumeroA = true;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -
  public setCantidadRealPasajeros(): void {
    this.cantidadRealPasajero = 0;
    this.avionService.query().subscribe((res: HttpResponse<IAvion[]>) => {
      res.body?.forEach((avion: IAvion) => {
        if (this.editForm.get(['avion'])?.value.id === avion.id) {
          this.pasajeroService.query().subscribe((res2: HttpResponse<IPasajero[]>) => {
            res2.body?.forEach((pasajero: IPasajero) => {
              if (pasajero.avion?.id === avion.id && this.editForm.get(['id'])?.value !== pasajero.id) {
                this.cantidadRealPasajero++;
              }
            });
            if (this.cantidadRealPasajero === this.editForm.get(['avion'])?.value.modelo.cantidadPasajeros) {
              this.isAvion = true;
            } else {
              this.isAvion = false;
              this.verificarNumeroAsiento();
            }
          });
        }
      });
    });
  }
  // -
  public verificarNumeroAsiento(): void {
    this.pasajeroService.query().subscribe((res: HttpResponse<IPasajero[]>) => {
      let verificador = false;
      res.body?.forEach((pasajero: IPasajero) => {
        if (this.editForm.get(['id'])?.value !== pasajero.id && this.editForm.get(['numeroAsiento'])?.value === pasajero.numeroAsiento) {
          verificador = true;
        }
      });
      this.isNumeroAExiste = verificador;
      if (this.isNumeroA === true) {
        console.log('4');
        this.isNumeroA = false;
      }
      console.log('5');
    });
  }
  //-

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION EQUIPAJES

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para cargar la lista de equipajes
  public loadEquipajes(pasajero: Pasajero): void {
    this.equipajesSharedCollection = [];
    // Funcion que nos devuelve todos los equipajes y que en funcion de estos modifica la coleccion de equipajes
    this.equipajeService.query().subscribe((res: HttpResponse<IEquipaje[]>) => {
      res.body?.forEach((equipaje: IEquipaje) => {
        // Condicion que determina si el equipaje esta asignado a un pasajero
        if (equipaje.pasajero === null) {
          // El equipaje no esta asigando a un pasajero y por tanto se puede añadir al pasajero
          this.equipajesSharedCollection.push(equipaje);
        } else {
          // Condicion que determina si el equipaje tiene un pasajero asignada es el mismo pasajero que el que se esta mostrando
          if (pasajero.id === equipaje.pasajero?.id) {
            this.equipajesSharedCollection.push(equipaje);
            // Refleja que el equipaje ya esta añadido a la lista de equipajes ya que se añadio anteriormente en una modificacion anterior del avion
            this.anadirEquipajeP(equipaje);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que añade un equipaje a la lista de equipajes
  public anadirEquipajeP(equipaje: IEquipaje): void {
    this.listaEquipajeP.push(equipaje);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para añadir equipajes a la lista de equipajes a añadir
  public anadirEquipaje(equipaje: IEquipaje, e: any): void {
    // Camnbia el tipo de boton segun si el boton esta en añadir o eliminar
    if (e.classList.contains('btn-outline-primary')) {
      // Añade el equipaje a la lista de equipajes para añadir
      this.listaEquipajeP.push(equipaje);
      this.listaEquipajeP = this.ordenarListaEquipaje(this.listaEquipajeP);
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-primary');
      e.classList.add('btn-outline-danger');
      e.textContent = 'Eliminar';
    } else {
      // Recorre la lista identificando, para eliminar el equipaje de la lista de equipajes a añadir
      for (let i = 0; i < this.listaEquipajeP.length; i++) {
        if (this.listaEquipajeP[i] === equipaje) {
          this.listaEquipajeP.splice(i, 1);
        }
      }
      //Cambia las propiedades del boton
      e.classList.remove('btn-outline-danger');
      e.classList.add('btn-outline-primary');
      e.textContent = 'Añadir';
    }
    this.verificarNumeroEquipaje();
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo agregado
  // Devuelve una lista ordenada de la lista de equipajaes asignados
  public ordenarListaEquipaje(equipajes: IEquipaje[]): IEquipaje[] {
    // Lista axuliar para los ids
    const listaId: any[] = [];
    // Guardo todos los ids en la lista auxiliar
    equipajes.forEach(element => listaId.push(element.id));
    // Ordeno la lista auxiliar por id
    listaId.sort(function (a, b) {
      return a - b;
    });
    // Lista definitiva ordenada
    const listaOrdenada: IEquipaje[] = [];
    // Recorro la lista de equipajes pasada como parametro
    for (let i = 0; i < listaId.length; i++) {
      // Comparo cada id de la lista de equipajes por cada id de la lista de id ordenada
      for (let z = 0; z < equipajes.length; z++) {
        // Si el id coincide se agrega a la lista
        if (listaId[i] === equipajes[z].id) {
          listaOrdenada.push(equipajes[z]);
        }
      }
    }
    return listaOrdenada;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION VERIFICACIONES

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para gestionar las verificaciones necesarioas para el control de asignacion de control numeroAsiento
  public verificarNumeroEquipaje(): void {
    if (this.editForm.get(['cantidadEquipaje'])?.value === this.listaEquipajeP.length) {
      this.isNumeroE = false;
    } else {
      this.isNumeroE = true;
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo encargado de que dado el caso si el valor de cantidad de equipaje sea 0 se eliminen la lista de equipajes añadidos
  public verificarListaEquipaje(): void {
    if (this.editForm.get(['cantidadEquipaje'])?.value === 0) {
      this.listaEquipajeP.splice(0, this.listaEquipajeP.length);
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo encargado de mostrar u ocultar la tabla
  public mostrarOcultarTabla(i: number, e: any): void {
    const elemento = document.getElementsByClassName('custom-control-label')[i];
    if (elemento.innerHTML === 'Ocultar') {
      elemento.innerHTML = 'Mostrar';
    } else {
      elemento.innerHTML = 'Ocultar';
    }
    switch (e) {
      case 'cuerpoTablaEquipaje': {
        this.hiddenEquipajes = !this.hiddenEquipajes;
        break;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

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
      equipajes: this.listaEquipajeP,
    };
  }
}
