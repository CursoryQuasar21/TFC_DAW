import { ICiudad } from 'app/entities/ciudad/ciudad.model';

export interface IPais {
  id?: number;
  nombre?: string;
  ciudads?: ICiudad[] | null;
}

export class Pais implements IPais {
  constructor(public id?: number, public nombre?: string, public ciudads?: ICiudad[] | null) {}
}

export function getPaisIdentifier(pais: IPais): number | undefined {
  return pais.id;
}
