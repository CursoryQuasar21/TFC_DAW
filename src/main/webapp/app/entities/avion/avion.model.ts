import * as dayjs from 'dayjs';
import { IPiloto } from 'app/entities/piloto/piloto.model';
import { ITripulante } from 'app/entities/tripulante/tripulante.model';
import { IPasajero } from 'app/entities/pasajero/pasajero.model';
import { IVuelo } from 'app/entities/vuelo/vuelo.model';
import { IModelo } from 'app/entities/modelo/modelo.model';
import { IAeropuerto } from 'app/entities/aeropuerto/aeropuerto.model';

export interface IAvion {
  id?: number;
  costeFabricacion?: number;
  anioFabricacion?: dayjs.Dayjs;
  pilotos?: IPiloto[] | null;
  tripulantes?: ITripulante[] | null;
  pasajeros?: IPasajero[] | null;
  vuelo?: IVuelo | null;
  modelo?: IModelo | null;
  aeropuerto?: IAeropuerto | null;
}

export class Avion implements IAvion {
  constructor(
    public id?: number,
    public costeFabricacion?: number,
    public anioFabricacion?: dayjs.Dayjs,
    public pilotos?: IPiloto[] | null,
    public tripulantes?: ITripulante[] | null,
    public pasajeros?: IPasajero[] | null,
    public vuelo?: IVuelo | null,
    public modelo?: IModelo | null,
    public aeropuerto?: IAeropuerto | null
  ) {}
}

export function getAvionIdentifier(avion: IAvion): number | undefined {
  return avion.id;
}
