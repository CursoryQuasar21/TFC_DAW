import * as dayjs from 'dayjs';
import { IAvion } from 'app/entities/avion/avion.model';
import { IAeropuerto } from 'app/entities/aeropuerto/aeropuerto.model';

export interface IVuelo {
  id?: number;
  fechaOrigen?: dayjs.Dayjs;
  fechaDestino?: dayjs.Dayjs;
  precio?: number;
  avion?: IAvion | null;
  aeropuertos?: IAeropuerto[] | null;
}

export class Vuelo implements IVuelo {
  constructor(
    public id?: number,
    public fechaOrigen?: dayjs.Dayjs,
    public fechaDestino?: dayjs.Dayjs,
    public precio?: number,
    public avion?: IAvion | null,
    public aeropuertos?: IAeropuerto[] | null
  ) {}
}

export function getVueloIdentifier(vuelo: IVuelo): number | undefined {
  return vuelo.id;
}
