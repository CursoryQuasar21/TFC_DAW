import { IEquipaje } from 'app/entities/equipaje/equipaje.model';
import { IAvion } from 'app/entities/avion/avion.model';

export interface IPasajero {
  id?: number;
  nombre?: string;
  apellidos?: string;
  pasaporte?: string;
  cantidadEquipaje?: number;
  numeroAsiento?: number | null;
  equipajes?: IEquipaje[] | null;
  avion?: IAvion | null;
}

export class Pasajero implements IPasajero {
  constructor(
    public id?: number,
    public nombre?: string,
    public apellidos?: string,
    public pasaporte?: string,
    public cantidadEquipaje?: number,
    public numeroAsiento?: number | null,
    public equipajes?: IEquipaje[] | null,
    public avion?: IAvion | null
  ) {}
}

export function getPasajeroIdentifier(pasajero: IPasajero): number | undefined {
  return pasajero.id;
}
