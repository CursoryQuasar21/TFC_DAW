import { IPasajero } from 'app/entities/pasajero/pasajero.model';

export interface IEquipaje {
  id?: number;
  tipo?: string;
  pasajero?: IPasajero | null;
}

export class Equipaje implements IEquipaje {
  constructor(public id?: number, public tipo?: string, public pasajero?: IPasajero | null) {}
}

export function getEquipajeIdentifier(equipaje: IEquipaje): number | undefined {
  return equipaje.id;
}
