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
import { Aeropuerto, IAeropuerto } from 'app/entities/aeropuerto/aeropuerto.model';
import { AeropuertoService } from 'app/entities/aeropuerto/service/aeropuerto.service';
import { IPiloto, Piloto } from '../../piloto/piloto.model';
import { PilotoService } from '../../piloto/service/piloto.service';
import { ITripulante, Tripulante } from '../../tripulante/tripulante.model';
import { TripulanteService } from '../../tripulante/service/tripulante.service';
import { IPasajero, Pasajero } from '../../pasajero/pasajero.model';
import { PasajeroService } from '../../pasajero/service/pasajero.service';
import { IPais, Pais } from '../../pais/pais.model';
import { PaisService } from '../../pais/service/pais.service';
import { ICiudad, Ciudad } from '../../ciudad/ciudad.model';
import { CiudadService } from '../../ciudad/service/ciudad.service';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'jhi-avion-update',
  templateUrl: './avion-update.component.html',
})
export class AvionUpdateComponent implements OnInit {
  isSaving = false;
  // ==================================================================================================================================
  // SECCION VERIFICADORES

  // -------------------------------------------------------------------------------------------------------------------------------
  // Verificador que se va a encargar de verificar la cantidad de pilotos mediante un booleano en funcion del modelo del Avion
  isPilotos = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Verificador que se va a encargar de verificar la cantidad de tripulantes mediante un booleano en funcion del modelo del Avion
  isTripulantes = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Verificador que se va a encargar de verificar la cantidad de pasajeros mediante un booleano en funcion del modelo del Avion
  isPasajeros = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Verificador que se va a encargar de verificar la cantidad de equipajes mediante un booleano en funcion del modelo del Avion
  isEquipaje = false;
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION SWITCH PARA MOSTRAR Y OCULTAR TABLAS DE PERSONAS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Switch que se va a encargar de controlar si el cuerpo de la tabla pilotos se muestra o no
  hiddenPilotos = true;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Switch que se va a encargar de controlar si el cuerpo de la tabla tripulantes se muestra o no
  hiddenTripulantes = true;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Switch que se va a encargar de controlar si el cuerpo de la tabla pasajeros se muestra o no
  hiddenPasajeros = true;
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  modelosSharedCollection: IModelo[] = [];

  // ==================================================================================================================================
  // SECCION AEROPUERTO

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion del pais seleccionado
  paisesSharedCollection: IPais[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion de la ciudad seleccionada
  ciudadesSharedCollection: ICiudad[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion del aeropuerto seleccionado
  aeropuertosSharedCollection: IAeropuerto[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION Listas Personas

  // -------------------------------------------------------------------------------------------------------------------------------
  // Coleccion de pilotos para asignar al avion
  pilotosSharedCollection: IPiloto[] = [];

  // Collecion de pilotos asignados al avion
  listaPilotosAbordo: IPiloto[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Coleccion de tripulantes para asignar al avion
  tripulantesSharedCollection: ITripulante[] = [];

  // Coleccion de tripulantes asignados al avion
  listaTripulantesAbordo: ITripulante[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Coleccion de pasajeros para asignar al avion
  pasajerosSharedCollection: IPasajero[] = [];

  // Coleccion de pasajeros asignados al avion
  listaPasajerosAbordo: IPasajero[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // Lista de numeros de los asientos del avion
  listaNumeroAsientos: number[] = [];

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
    protected paisService: PaisService,
    protected ciudadService: CiudadService,
    protected aeropuertoService: AeropuertoService,
    protected pilotoService: PilotoService,
    protected tripulanteService: TripulanteService,
    protected pasajeroService: PasajeroService,
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

      // -------------------------------------------------------------------------------------------------------------------------------

      // Metodo que cargan las listas de las zonas
      this.loadListasZonas(avion.aeropuerto);

      // Metodo que cargan las listas de las personas
      this.loadListasPersonas(avion);

      // Metodo que inicializa la lista de los asientos
      this.loadListaAsientos(avion);

      // -------------------------------------------------------------------------------------------------------------------------------
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

  getCantidadEquipaje(): number {
    let cantidadEquipaje = 0;
    this.listaPasajerosAbordo.forEach((pasajero: IPasajero) => {
      cantidadEquipaje += pasajero.cantidadEquipaje!;
    });
    return cantidadEquipaje;
  }
  trackModeloById(index: number, item: IModelo): number {
    return item.id!;
  }

  // ==================================================================================================================================
  // SECCION DE METODOS PARA MANEJAR LAS LISTAS EN EL HTML

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackPaisById(index: number, item: IPais): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackCiudadById(index: number, item: ICiudad): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackAeropuertoById(index: number, item: IAeropuerto): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackPilotoById(index: number, item: IPiloto): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackTripulanteById(index: number, item: ITripulante): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  trackPasajeroById(index: number, item: IPasajero): number {
    return item.id!;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION NUMERO ASIENTOS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para darle valores a la lista de asientos
  public getCapacidadMaximaAsientos(): number {
    const capacidadMaxima = 853;
    if (this.editForm.get(['modelo'])?.value !== null && this.editForm.get(['modelo'])?.value !== undefined) {
      return Number(this.editForm.get(['modelo'])?.value.cantidadPasajeros);
    }
    return capacidadMaxima;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para darle valores a la lista de asientos
  public loadListaAsientos(avion: IAvion): void {
    this.listaNumeroAsientos = [];
    for (let i = 10; i < this.getCapacidadMaximaAsientos(); i++) {
      this.listaNumeroAsientos.push(i);
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION AEROPUERTOS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar Listas de paises, ciudades y aeropuertos
  public loadListasZonas(e: any): void {
    this.loadPaises(e);
    this.loadCiudades(null);
    //this.loadAeropuertos(e);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar paises
  public loadPaises(e: any): void {
    this.paisesSharedCollection = [];
    this.paisService.query().subscribe((res: HttpResponse<IPais[]>) => {
      res.body?.forEach((pais: IPais) => {
        // Condicion que determina si el pasajero esta asignado a un avion
        this.paisesSharedCollection.push(pais);
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar ciudades
  public loadCiudades(e: any): void {
    this.ciudadesSharedCollection = [];
    this.ciudadService.query().subscribe((res: HttpResponse<ICiudad[]>) => {
      res.body?.forEach((ciudad: ICiudad) => {
        if (e === null) {
          this.ciudadesSharedCollection.push(ciudad);
        } else {
          if (e === ciudad.id) {
            this.ciudadesSharedCollection.push(ciudad);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar aeropuertos
  public loadAeropuertos(e: any): void {
    this.aeropuertosSharedCollection = [];
    this.aeropuertoService.query().subscribe((res: HttpResponse<IAeropuerto[]>) => {
      res.body?.forEach((aeropuerto: IAeropuerto) => {
        if (e === null) {
          this.aeropuertosSharedCollection.push(aeropuerto);
        } else {
          if (e === aeropuerto.ciudad?.id) {
            this.aeropuertosSharedCollection.push(aeropuerto);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para actualizar la lista de ciudades en funcion del pais seleccionado
  public cambiarlistaCiudades(e: any): void {
    if (e.target.value !== 'null') {
      this.ciudadesSharedCollection = [];
      this.paisesSharedCollection.forEach((pais: IPais) => {
        if (Number(e.target.value) === pais.id) {
          this.loadCiudades(Number(e.target.value));
        }
      });
    } else {
      this.loadCiudades(null);
      this.loadAeropuertos(null);
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para actualizar la lista de aeropuertos en funcion de la ciudad seleccionada
  public cambiarlistaAeropuertos(e: any): void {
    if (e.target.value !== 'null') {
      this.aeropuertosSharedCollection = [];
      this.ciudadesSharedCollection.forEach((ciudad: ICiudad) => {
        if (Number(e.target.value) === ciudad.id) {
          this.loadAeropuertos(Number(e.target.value));
        }
      });
    } else {
      this.loadAeropuertos(null);
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION ACTUALIZAR ASIENTOS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para asignar el numero de asiento si el pasajero no dispone de uno en el avion
  public asignarAsiento(pasajero: Pasajero): Pasajero {
    if (pasajero.numeroAsiento !== null && pasajero.numeroAsiento !== undefined) {
      this.eliminarAsientoListaAsientos(pasajero.numeroAsiento);
    } else {
      pasajero.numeroAsiento = this.actualizarListaAsientos();
    }
    return pasajero;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que devuelve un asiento libre al pasajero
  public actualizarListaAsientos(): number {
    const index = Math.trunc(Math.random() * this.listaNumeroAsientos.length);
    const valor = this.listaNumeroAsientos[index];
    this.listaNumeroAsientos.splice(index, 1);
    return valor;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para eliminar el asiento libre de la lista de asientos libres
  public eliminarAsientoListaAsientos(asiento: number): void {
    for (let i = 10; i < this.getCapacidadMaximaAsientos(); i++) {
      if (this.listaNumeroAsientos[i] === asiento) {
        this.listaNumeroAsientos.splice(i, 1);
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo Inactivo por motivos de objetivos del proyecto
  // Metodo para actualizar el asiento
  //  public actualizarAsiento(e:any,pasajeroE:Pasajero):void{
  //    this.pasajerosSharedCollection.forEach((pasajero: IPasajero) => {
  //      if(pasajeroE.id===pasajero.id){
  //        pasajero.numeroAsiento=Number(e.target.value)
  //      }
  //    });
  //  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo Inactivo por motivos de objetivos del proyecto
  // Metodo para verificar el asiento
  //  public comprobarNum():boolean{
  //    if(this.numero1>=10 && this.numero1<=853){
  //      //  eslint-disable-next-line no-console
  //      console.log("false")
  //      return false
  //    }else{
  //      //  eslint-disable-next-line no-console
  //      console.log("true")
  //      return true
  //    }
  //  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION PERSONAS PARA CARGAR

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar Listas de pilotos, tripulantes y ciudades
  public loadListasPersonas(avion: Avion): void {
    this.loadPilotos(avion);
    this.loadTripulantes(avion);
    this.loadPasajeros(avion);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que nos devuelve todos los pilotos y que en funcion de estos modifica la coleccion de pilotosAbordo
  public loadPilotos(avion: Avion): void {
    // Peticion al servidor para acceder a la basse de datos y obtener la lista de pilotos
    this.pilotoService.query().subscribe((res: HttpResponse<Piloto[]>) => {
      res.body?.forEach((piloto: IPiloto) => {
        // Condicion que determina si el piloto esta asignado a un avion
        if (piloto.avion === null) {
          // El piloto no esta asigando a un avion y por tanto se puede subir al avion
          this.pilotosSharedCollection.push(piloto);
        } else {
          // Condicion que determina si el piloto que tiene un avion asignada es el mismo avion que la que se esta mostrando
          if (avion.id === piloto.avion?.id) {
            this.pilotosSharedCollection.push(piloto);
            // Refleja que el piloto ya esta añadido a la lista de pilotos ya que se añadio anteriormente en una modificacion anterior del avion
            this.anadirpilotoAbordo(piloto);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que añade un piloto a la lista de pilotos
  public anadirpilotoAbordo(piloto: IPiloto): void {
    this.listaPilotosAbordo.push(piloto);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que nos devuelve todos los tripulantes y que en funcion de estos modifica la coleccion de tripulantesAbordo
  public loadTripulantes(avion: Avion): void {
    // Peticion al servidor para acceder a la basse de datos y obtener la lista de tripulantes
    this.tripulanteService.query().subscribe((res: HttpResponse<ITripulante[]>) => {
      res.body?.forEach((tripulante: ITripulante) => {
        // Condicion que determina si el tripulante esta asignado a un avion
        if (tripulante.avion === null) {
          // El tripulante no esta asigando a un avion y por tanto se puede subir al avion
          this.tripulantesSharedCollection.push(tripulante);
        } else {
          // Condicion que determina si el tripulante que tiene un avion asignada es el mismo avion que la que se esta mostrando
          if (avion.id === tripulante.avion?.id) {
            this.tripulantesSharedCollection.push(tripulante);
            // Refleja que el tripulante ya esta añadido a la lista de tripulantes ya que se añadio anteriormente en una modificacion anterior del avion
            this.anadirTripulanteAbordo(tripulante);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que añade un tripulante a la lista de tripulantes
  public anadirTripulanteAbordo(tripulante: ITripulante): void {
    this.listaTripulantesAbordo.push(tripulante);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que nos devuelve todos los pasajeros y que en funcion de estos modifica la coleccion de pasajerosAbordo
  public loadPasajeros(avion: Avion): void {
    // Peticion al servidor para acceder a la basse de datos y obtener la lista de pasajeros
    this.pasajeroService.query().subscribe((res: HttpResponse<IPasajero[]>) => {
      res.body?.forEach((pasajero: IPasajero) => {
        const pasajero1 = this.asignarAsiento(pasajero);
        // Condicion que determina si el pasajero esta asignado a un avion
        if (pasajero.avion === null) {
          // El pasajero no esta asigando a un avion y por tanto se puede subir al avion
          this.pasajerosSharedCollection.push(pasajero1);
        } else {
          // Condicion que determina si el pasajero que tiene un avion asignada es el mismo avion que la que se esta mostrando
          if (avion.id === pasajero.avion?.id) {
            this.pasajerosSharedCollection.push(pasajero);
            // Refleja que el pasajero ya esta añadido a la lista de pasajeros ya que se añadio anteriormente en una modificacion anterior del avion
            this.anadirPasajeroAbordo(pasajero);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo que añade un pasajero a la lista de pasajeros
  public anadirPasajeroAbordo(pasajero: IPasajero): void {
    this.listaPasajerosAbordo.push(pasajero);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION PARA ACTUALIZAR LISTAS PERSONAS ABORDO Y ACTUALIZAR COMPONENTES DEL HTML

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para añadir pilotos a la lista de pilotos abordo y actualizar componentes del html de la tabla de pilotos
  public anadirPiloto(piloto: IPiloto, e: any): void {
    // Camnbia el tipo de boton segun si el boton esta en añadir o eliminar
    if (e.classList.contains('btn-outline-primary')) {
      // Añade el piloto a la lista de pilotos a bordo
      this.listaPilotosAbordo.push(piloto);
      // Reordenacion de la lista de pilotos abordo
      this.listaPilotosAbordo = this.ordenarListaPilotosAbordo(this.listaPilotosAbordo);
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-primary');
      e.classList.add('btn-outline-danger');
      e.textContent = 'Eliminar';
    } else {
      //  Recorre la lista identificando, para eliminar el piloto de la lista de pilotos abordo
      for (let i = 0; i < this.listaPilotosAbordo.length; i++) {
        if (this.listaPilotosAbordo[i] === piloto) {
          this.listaPilotosAbordo.splice(i, 1);
        }
      }
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-danger');
      e.classList.add('btn-outline-primary');
      e.textContent = 'Añadir';
    }
    this.verificarCantidadPilotos();
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  //  Metodo agregado
  //  Devuelve uan lista ordenada de la lista de pilotos en el avion
  public ordenarListaPilotosAbordo(pilotos: IPiloto[]): IPiloto[] {
    pilotos.sort(function (a, b) {
      if (a.id && b.id) {
        return a.id - b.id;
      } else {
        return 0;
      }
    });
    return pilotos;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para añadir tripulantes a la lista de tripulantes abordo y actualizar componentes del html de la tabla de tripulantes
  public anadirTripulante(tripulante: ITripulante, e: any): void {
    // Camnbia el tipo de boton segun si el boton esta en añadir o eliminar
    if (e.classList.contains('btn-outline-primary')) {
      // Añade el tripulante a la lista de tripulantes a bordo
      this.listaTripulantesAbordo.push(tripulante);
      // Reordenacion de la lista de tripulantes abordo
      this.listaTripulantesAbordo = this.ordenarListaTripulantesAbordo(this.listaTripulantesAbordo);
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-primary');
      e.classList.add('btn-outline-danger');
      e.textContent = 'Eliminar';
    } else {
      //  Recorre la lista identificando, para eliminar el tripulante de la lista de tripulantes abordo
      for (let i = 0; i < this.listaTripulantesAbordo.length; i++) {
        if (this.listaTripulantesAbordo[i] === tripulante) {
          this.listaTripulantesAbordo.splice(i, 1);
        }
      }
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-danger');
      e.classList.add('btn-outline-primary');
      e.textContent = 'Añadir';
    }
    this.verificarCantidadTripulantes();
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  //  Metodo agregado
  //  Devuelve uan lista ordenada de la lista de pasajeros en el avion
  public ordenarListaTripulantesAbordo(tripulantes: ITripulante[]): ITripulante[] {
    tripulantes.sort(function (a, b) {
      if (a.id && b.id) {
        return a.id - b.id;
      } else {
        return 0;
      }
    });
    return tripulantes;
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para añadir pasajeros a la lista de pasajeros abordo y actualizar componentes del html de la tabla de pasajeros
  public anadirPasajero(pasajero: IPasajero, e: any): void {
    // Camnbia el tipo de boton segun si el boton esta en añadir o eliminar
    if (e.classList.contains('btn-outline-primary')) {
      // Añade el pasajero a la lista de pasajeros a bordo
      this.listaPasajerosAbordo.push(pasajero);
      // Reordenacion de la lista de pasajeros abordo
      this.listaPasajerosAbordo = this.ordenarListaPasajerosAbordo(this.listaPasajerosAbordo);
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-primary');
      e.classList.add('btn-outline-danger');
      e.textContent = 'Eliminar';
    } else {
      //  Recorre la lista identificando, para eliminar el pasajero de la lista de pasajeros abordo
      for (let i = 0; i < this.listaPasajerosAbordo.length; i++) {
        if (this.listaPasajerosAbordo[i] === pasajero) {
          this.listaPasajerosAbordo.splice(i, 1);
        }
      }
      // Cambia las propiedades del boton
      e.classList.remove('btn-outline-danger');
      e.classList.add('btn-outline-primary');
      e.textContent = 'Añadir';
    }
    this.verificarCantidadPasajeros();
    this.verificarCantidadEquipaje();
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo agregado
  // Devuelve uan lista ordenada de la lista de pasajeros en el avion
  public ordenarListaPasajerosAbordo(pasajeros: IPasajero[]): IPasajero[] {
    pasajeros.sort(function (a, b) {
      if (a.id && b.id) {
        return a.id - b.id;
      } else {
        return 0;
      }
    });
    return pasajeros;
    //  Lista axuliar para los ids
    //  const listaId: any[] = [];
    //  // Guardo todos los ids en la lista auxiliar
    //  pasajeros.forEach(element => listaId.push(element.id));
    //  // Ordeno la lista auxiliar por id
    //  listaId.sort(function (a, b) {
    //    return a - b;
    //  });
    //  // Lista definitiva ordenada
    //  const listaOrdenada: IPasajero[] = [];
    //  // Recorro la lista de pasajeros pasada como parametro
    //  for (let i = 0; i < listaId.length; i++) {
    //    // Comparo cada id de la lista de pasajeros por cada id de la lista de id ordenada
    //    for (let z = 0; z < pasajeros.length; z++) {
    //      // Si el id coincide se agrega a la lista
    //      if (listaId[i] === pasajeros[z].id) {
    //        listaOrdenada.push(pasajeros[z]);
    //      }
    //    }
    //  }
    // return listaOrdenada;
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
      case 'cuerpoTablaPilotos': {
        this.hiddenPilotos = !this.hiddenPilotos;
        break;
      }
      case 'cuerpoTablaTripulantes': {
        this.hiddenTripulantes = !this.hiddenTripulantes;
        break;
      }
      default: {
        this.hiddenPasajeros = !this.hiddenPasajeros;
        break;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION VERIFICACION PERSONAS Y EQUIPAJE PARA SAVE

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo agregado
  // Metodo para verificar la cantidad de pilotos respecto al modelo seleccionado
  public verificarCantidadPilotos(): void {
    if (this.editForm.get(['modelo'])?.value !== null && this.editForm.get(['modelo'])?.value !== undefined) {
      if (this.editForm.get(['modelo'])!.value.cantidadPilotos !== this.listaPilotosAbordo.length) {
        this.isPilotos = true;
      } else {
        this.isPilotos = false;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo agregado
  // Metodo para verificar la cantidad de tripulantes respecto al modelo seleccionado
  public verificarCantidadTripulantes(): void {
    if (this.editForm.get(['modelo'])?.value !== null && this.editForm.get(['modelo'])?.value !== undefined) {
      if (this.editForm.get(['modelo'])!.value.cantidadTripulantes !== this.listaTripulantesAbordo.length) {
        this.isTripulantes = true;
      } else {
        this.isTripulantes = false;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo agregado
  // Metodo para verificar la cantidad de pasajeros respecto al modelo seleccionado
  public verificarCantidadPasajeros(): void {
    if (this.editForm.get(['modelo'])?.value !== null && this.editForm.get(['modelo'])?.value !== undefined) {
      if (this.listaPasajerosAbordo.length <= this.editForm.get(['modelo'])!.value.cantidadPasajeros) {
        this.isPasajeros = false;
      } else {
        this.isPasajeros = true;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo agregado
  // Metodo para verificar la cantidad de equipaje respecto al modelo seleccionado
  public verificarCantidadEquipaje(): void {
    if (this.editForm.get(['modelo'])?.value !== null && this.editForm.get(['modelo'])?.value !== undefined) {
      if (this.getCantidadEquipaje() <= this.editForm.get(['modelo'])!.value.cantidadEquipajes) {
        this.isEquipaje = false;
      } else {
        this.isEquipaje = true;
      }
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

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
    //  Api for inheritance.
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
      pilotos: this.listaPilotosAbordo,
      tripulantes: this.listaTripulantesAbordo,
      pasajeros: this.listaPasajerosAbordo,
    };
  }
}
