import { IAeropuerto } from 'app/entities/aeropuerto/aeropuerto.model';
import { IPais } from 'app/entities/pais/pais.model';

export interface ICiudad {
  id?: number;
  nombre?: string;
  aeropuertos?: IAeropuerto[] | null;
  pais?: IPais | null;
}

export class Ciudad implements ICiudad {
  constructor(public id?: number, public nombre?: string, public aeropuertos?: IAeropuerto[] | null, public pais?: IPais | null) {}
}

export function getCiudadIdentifier(ciudad: ICiudad): number | undefined {
  return ciudad.id;
}
