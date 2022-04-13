import { IAvion } from 'app/entities/avion/avion.model';
import { IVuelo } from 'app/entities/vuelo/vuelo.model';
import { ICiudad } from 'app/entities/ciudad/ciudad.model';

export interface IAeropuerto {
  id?: number;
  nombre?: string;
  avions?: IAvion[] | null;
  vuelos?: IVuelo[] | null;
  ciudad?: ICiudad | null;
}

export class Aeropuerto implements IAeropuerto {
  constructor(
    public id?: number,
    public nombre?: string,
    public avions?: IAvion[] | null,
    public vuelos?: IVuelo[] | null,
    public ciudad?: ICiudad | null
  ) {}
}

export function getAeropuertoIdentifier(aeropuerto: IAeropuerto): number | undefined {
  return aeropuerto.id;
}
