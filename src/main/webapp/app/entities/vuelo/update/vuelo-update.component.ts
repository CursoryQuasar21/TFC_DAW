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

import { IPais, Pais } from '../../pais/pais.model';
import { PaisService } from '../../pais/service/pais.service';
import { ICiudad, Ciudad } from '../../ciudad/ciudad.model';
import { CiudadService } from '../../ciudad/service/ciudad.service';
import { Aeropuerto, IAeropuerto } from 'app/entities/aeropuerto/aeropuerto.model';
import { AeropuertoService } from 'app/entities/aeropuerto/service/aeropuerto.service';

@Component({
  selector: 'jhi-vuelo-update',
  templateUrl: './vuelo-update.component.html',
})
export class VueloUpdateComponent implements OnInit {
  isSaving = false;

  avionsCollection: IAvion[] = [];

  // ==================================================================================================================================
  // SECCION AEROPUERTO

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion del pais seleccionado
  paisOrigen: IPais | undefined;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion de la ciudad seleccionada
  ciudadOrigen: ICiudad | undefined;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion del aeropuerto seleccionado
  aeropuertoOrigen: IAeropuerto | undefined;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion del pais seleccionado
  paisDestino: IPais | undefined;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion de la ciudad seleccionada
  ciudadDestino: ICiudad | undefined;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el origen del avion en funcion del aeropuerto seleccionado
  aeropuertoDestino: IAeropuerto | undefined;
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el destino del avion en funcion del pais seleccionado
  paisesSharedCollection: IPais[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el destino del avion en funcion de la ciudad seleccionada
  ciudadesSharedCollection: ICiudad[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Lista para filtrar el destino del avion en funcion del aeropuerto seleccionado
  aeropuertosSharedCollection: IAeropuerto[] = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  listaAerpouertosSeleccionados: IAeropuerto[] = [];
  // FIN SECCION
  // ==================================================================================================================================

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
    protected paisService: PaisService,
    protected ciudadService: CiudadService,
    protected aeropuertoService: AeropuertoService,
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

      // Metodo para cargar las zonas de origen del vuelo si tiene
      if (vuelo.avion !== null) {
        this.cargarListaZonasAvionOrigen(vuelo.avion);
      }
      this.cargarListaZonasAvionDestino(vuelo);
      // Metodo que cargan las listas de las zonas
      this.loadListasZonas(vuelo);
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

  // FIN SECCION
  // ==================================================================================================================================

  // ==================================================================================================================================
  // SECCION AEROPUERTOS

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar Listas de paises, ciudades y aeropuertos
  public loadListasZonas(e: any): void {
    this.loadPaises(null);
    this.loadCiudades(null);
    this.loadAeropuertos(null);
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
    this.aeropuertosSharedCollection = [];
    this.ciudadService.query().subscribe((res: HttpResponse<ICiudad[]>) => {
      res.body?.forEach((ciudad: ICiudad) => {
        if (e === null) {
          this.ciudadesSharedCollection.push(ciudad);
        } else {
          if (e === ciudad.pais?.id) {
            this.ciudadesSharedCollection.push(ciudad);
            // this.loadAeropuertosByCiudades(ciudad)
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar ciudades
  public loadAeropuertosByCiudad(e: any): void {
    this.aeropuertosSharedCollection = [];
    this.aeropuertoService.query().subscribe((res: HttpResponse<IAeropuerto[]>) => {
      res.body?.forEach((aeropuerto: IAeropuerto) => {
        if (this.aeropuertoOrigen !== undefined) {
          if (e === aeropuerto.ciudad?.id) {
            if (this.aeropuertoOrigen.id !== aeropuerto.id) {
              this.aeropuertosSharedCollection.push(aeropuerto);
            }
          }
        } else {
          if (aeropuerto.ciudad !== null && aeropuerto.ciudad !== undefined && e === aeropuerto.ciudad.id) {
            this.aeropuertosSharedCollection.push(aeropuerto);
          }
        }
      });
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Cargar ciudades
  public loadAeropuertosByAvion(e: any): void {
    let index = undefined;
    for (let i = 0; i < this.aeropuertosSharedCollection.length; i++) {
      if (this.aeropuertosSharedCollection[i].id === this.aeropuertoOrigen?.id) {
        index = i;
      }
    }
    console.log(this.aeropuertosSharedCollection);
    if (index !== undefined) {
      console.log(this.aeropuertosSharedCollection[index]);
      this.aeropuertosSharedCollection.splice(index, 1);
    }
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
          if (this.aeropuertoOrigen !== undefined) {
            if (this.aeropuertoOrigen.id !== aeropuerto.id) {
              this.aeropuertosSharedCollection.push(aeropuerto);
            }
          } else {
            this.aeropuertosSharedCollection.push(aeropuerto);
          }
        } else {
          if (this.aeropuertoOrigen !== undefined) {
            if (this.aeropuertoOrigen.id !== aeropuerto.id) {
              this.aeropuertosSharedCollection.push(aeropuerto);
            }
          } else {
            this.aeropuertosSharedCollection.push(aeropuerto);
          }
        }
        // if (e === null) {
        //   if(this.aeropuertoOrigen?.id !== aeropuerto.id){
        //     this.aeropuertosSharedCollection.push(aeropuerto);
        //   }
        // } else {
        //     if (e === aeropuerto.ciudad?.id) {
        //       if(this.ciudadDestino !== undefined){
        //         if(this.ciudadDestino.id === aeropuerto.ciudad?.id){
        //           if(this.aeropuertoOrigen !== undefined){
        //             if(this.aeropuertoOrigen.id !== aeropuerto.id){
        //               this.aeropuertosSharedCollection.push(aeropuerto);
        //             }
        //           }else{
        //             this.aeropuertosSharedCollection.push(aeropuerto);
        //           }
        //         }
        //       }else{
        //         if(this.aeropuertoOrigen !== undefined){
        //           if(this.aeropuertoOrigen.id !== aeropuerto.id){
        //             this.aeropuertosSharedCollection.push(aeropuerto);
        //           }
        //         }else{
        //           this.aeropuertosSharedCollection.push(aeropuerto);
        //         }
        //       }
        //     }
        //   }
      });
    });
    console.log(this.aeropuertosSharedCollection);
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para actualizar la lista de ciudades en funcion del pais seleccionado
  public cambiarlistaCiudades(e: any): void {
    console.log(e.target.value);
    if (e.target.value !== 'null') {
      this.ciudadesSharedCollection = [];
      this.paisesSharedCollection.forEach((pais: IPais) => {
        if (Number(e.target.value) === pais.id) {
          this.paisDestino = pais;
          this.ciudadDestino = undefined;
          this.aeropuertoDestino = undefined;
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
          this.ciudadDestino = ciudad;
          this.aeropuertoDestino = undefined;
          this.loadAeropuertosByCiudad(Number(e.target.value));
        }
      });
    } else {
      this.loadAeropuertos(null);
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para cargar las zonas de origen de donde parte el avion
  public cargarListaZonasAvionOrigen(avion: IAvion): void {
    this.avionService.query().subscribe((res: HttpResponse<IAvion[]>) => {
      res.body?.forEach((avion2: IAvion) => {
        if (avion.id === avion2.id) {
          avion = avion2;
        }
      });
      if (avion.aeropuerto !== null && avion.aeropuerto !== undefined) {
        this.aeropuertoService.query().subscribe((res2: HttpResponse<IAeropuerto[]>) => {
          res2.body?.forEach((aeropuerto: IAeropuerto) => {
            if (avion.aeropuerto?.id === aeropuerto.id) {
              this.aeropuertoOrigen = aeropuerto;
              //this.loadAeropuertos(aeropuerto.id)
              if (this.aeropuertoOrigen.ciudad !== null && this.aeropuertoOrigen.ciudad !== undefined) {
                this.ciudadOrigen = this.aeropuertoOrigen.ciudad;
                this.ciudadService.query().subscribe((res3: HttpResponse<ICiudad[]>) => {
                  res3.body?.forEach((ciudad: ICiudad) => {
                    if (this.ciudadOrigen?.id === ciudad.id && ciudad.pais !== null) {
                      this.paisOrigen = ciudad.pais;
                    }
                  });
                });
              }
            }
          });
        });
      }
    });
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para cargar las zonas de origen de donde parte el avion
  public cargarListaZonasAvionDestino(vuelo: IVuelo): void {
    if (vuelo.id !== undefined) {
      this.vueloService.find(vuelo.id).subscribe((res: HttpResponse<IVuelo>) => {
        const aeropuertosD = res.body?.aeropuertos;
        this.aeropuertoDestino = aeropuertosD![0];
        if (aeropuertosD!.length > 0) {
          this.cambiarListaZonasAvionDestino(aeropuertosD![0]);
        }
      });
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para actualizar las listas de origen y la lista de aeropuertos de destinos
  public cambiarListaZonasAvionOrigen(e: any): void {
    if (this.editForm.get(['avion'])!.value !== null && this.editForm.get(['avion'])!.value.aeropuerto !== null) {
      this.avionService.query().subscribe((res: HttpResponse<IAvion[]>) => {
        res.body?.forEach((avion: IAvion) => {
          if (this.editForm.get(['avion'])!.value.id === avion.id) {
            if (avion.aeropuerto !== null && avion.aeropuerto !== undefined) {
              this.aeropuertoService.query().subscribe((res2: HttpResponse<IAeropuerto[]>) => {
                res2.body?.forEach((aeropuerto: IAeropuerto) => {
                  if (avion.aeropuerto?.id === aeropuerto.id) {
                    this.aeropuertoOrigen = aeropuerto;
                    this.loadAeropuertosByAvion(aeropuerto);
                    if (this.aeropuertoOrigen.ciudad !== null && this.aeropuertoOrigen.ciudad !== undefined) {
                      this.ciudadOrigen = this.aeropuertoOrigen.ciudad;
                      this.ciudadService.query().subscribe((res3: HttpResponse<ICiudad[]>) => {
                        res3.body?.forEach((ciudad: ICiudad) => {
                          if (this.ciudadOrigen?.id === ciudad.id && ciudad.pais !== null) {
                            this.paisOrigen = ciudad.pais;
                          }
                        });
                      });
                    }
                  }
                });
              });
            } else {
              this.paisOrigen = undefined;
              this.ciudadOrigen = undefined;
              this.aeropuertoOrigen = undefined;
              this.loadAeropuertos(null);
            }
          }
        });
      });
    } else {
      this.paisOrigen = undefined;
      this.ciudadOrigen = undefined;
      this.aeropuertoOrigen = undefined;
      this.loadAeropuertos(null);
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Metodo Agregado
  // Metodo para actualizar las listas de origen y la lista de aeropuertos de destinos
  public cambiarListaZonasAvionDestino(e: any): void {
    if (e !== undefined && e !== null) {
      this.aeropuertoService.query().subscribe((res: HttpResponse<IAeropuerto[]>) => {
        res.body?.forEach((aeropuerto: IAeropuerto) => {
          if (e.id === aeropuerto.id) {
            this.aeropuertoDestino = aeropuerto;
            this.ciudadDestino = aeropuerto.ciudad!;
            this.ciudadService.query().subscribe((res2: HttpResponse<ICiudad[]>) => {
              res2.body?.forEach((ciudad: ICiudad) => {
                if (this.ciudadDestino!.id === ciudad.id) {
                  this.paisDestino = ciudad.pais!;
                }
              });
            });
          }
        });
      });
    } else {
      this.paisDestino = undefined;
      this.ciudadDestino = undefined;
      this.aeropuertoDestino = undefined;
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  public actualizarDestino(e: any): void {
    if (e.target.value !== 'null') {
      this.aeropuertoService.query().subscribe((res: HttpResponse<IAeropuerto[]>) => {
        res.body?.forEach((aeropuerto: IAeropuerto) => {
          if (Number(e.target.value) === aeropuerto.id) {
            this.aeropuertoDestino = aeropuerto;
            console.log(this.aeropuertoDestino);
          }
        });
      });
    } else {
      this.aeropuertoDestino = undefined;
    }
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
    let id1 = undefined;
    let id2 = undefined;

    if (this.aeropuertoOrigen !== undefined) {
      id1 = this.aeropuertoOrigen.id;
    }

    if (this.aeropuertoDestino !== undefined) {
      id2 = this.aeropuertoDestino.id;
    }
    console.log(id1);
    console.log(id2);
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
      aeropuertos: [new Aeropuerto(id1), new Aeropuerto(id2)],
    };
  }
}
