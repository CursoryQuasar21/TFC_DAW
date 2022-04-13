import { IAvion } from 'app/entities/avion/avion.model';

export interface ITripulante {
  id?: number;
  nombre?: string;
  apellidos?: string;
  pasaporte?: string;
  avion?: IAvion | null;
}

export class Tripulante implements ITripulante {
  constructor(
    public id?: number,
    public nombre?: string,
    public apellidos?: string,
    public pasaporte?: string,
    public avion?: IAvion | null
  ) {}
}

export function getTripulanteIdentifier(tripulante: ITripulante): number | undefined {
  return tripulante.id;
}
