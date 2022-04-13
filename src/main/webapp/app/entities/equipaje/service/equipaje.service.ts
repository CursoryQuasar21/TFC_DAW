import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEquipaje, getEquipajeIdentifier } from '../equipaje.model';

export type EntityResponseType = HttpResponse<IEquipaje>;
export type EntityArrayResponseType = HttpResponse<IEquipaje[]>;

@Injectable({ providedIn: 'root' })
export class EquipajeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/equipajes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(equipaje: IEquipaje): Observable<EntityResponseType> {
    return this.http.post<IEquipaje>(this.resourceUrl, equipaje, { observe: 'response' });
  }

  update(equipaje: IEquipaje): Observable<EntityResponseType> {
    return this.http.put<IEquipaje>(`${this.resourceUrl}/${getEquipajeIdentifier(equipaje) as number}`, equipaje, { observe: 'response' });
  }

  partialUpdate(equipaje: IEquipaje): Observable<EntityResponseType> {
    return this.http.patch<IEquipaje>(`${this.resourceUrl}/${getEquipajeIdentifier(equipaje) as number}`, equipaje, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEquipaje>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEquipaje[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEquipajeToCollectionIfMissing(equipajeCollection: IEquipaje[], ...equipajesToCheck: (IEquipaje | null | undefined)[]): IEquipaje[] {
    const equipajes: IEquipaje[] = equipajesToCheck.filter(isPresent);
    if (equipajes.length > 0) {
      const equipajeCollectionIdentifiers = equipajeCollection.map(equipajeItem => getEquipajeIdentifier(equipajeItem)!);
      const equipajesToAdd = equipajes.filter(equipajeItem => {
        const equipajeIdentifier = getEquipajeIdentifier(equipajeItem);
        if (equipajeIdentifier == null || equipajeCollectionIdentifiers.includes(equipajeIdentifier)) {
          return false;
        }
        equipajeCollectionIdentifiers.push(equipajeIdentifier);
        return true;
      });
      return [...equipajesToAdd, ...equipajeCollection];
    }
    return equipajeCollection;
  }
}
