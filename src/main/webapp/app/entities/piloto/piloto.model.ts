import { IAvion } from 'app/entities/avion/avion.model';

export interface IPiloto {
  id?: number;
  nombre?: string;
  apellidos?: string;
  pasaporte?: string;
  avion?: IAvion | null;
}

export class Piloto implements IPiloto {
  constructor(
    public id?: number,
    public nombre?: string,
    public apellidos?: string,
    public pasaporte?: string,
    public avion?: IAvion | null
  ) {}
}

export function getPilotoIdentifier(piloto: IPiloto): number | undefined {
  return piloto.id;
}
