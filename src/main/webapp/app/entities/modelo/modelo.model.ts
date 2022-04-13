import { IAvion } from 'app/entities/avion/avion.model';

export interface IModelo {
  id?: number;
  nombre?: string;
  motores?: number;
  cantidadPilotos?: number;
  cantidadTripulantes?: number;
  cantidadPasajeros?: number;
  cantidadEquipajes?: number;
  avions?: IAvion[] | null;
}

export class Modelo implements IModelo {
  constructor(
    public id?: number,
    public nombre?: string,
    public motores?: number,
    public cantidadPilotos?: number,
    public cantidadTripulantes?: number,
    public cantidadPasajeros?: number,
    public cantidadEquipajes?: number,
    public avions?: IAvion[] | null
  ) {}
}

export function getModeloIdentifier(modelo: IModelo): number | undefined {
  return modelo.id;
}
