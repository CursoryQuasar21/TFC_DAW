import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPasajero, getPasajeroIdentifier } from '../pasajero.model';

export type EntityResponseType = HttpResponse<IPasajero>;
export type EntityArrayResponseType = HttpResponse<IPasajero[]>;

@Injectable({ providedIn: 'root' })
export class PasajeroService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/pasajeros');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(pasajero: IPasajero): Observable<EntityResponseType> {
    return this.http.post<IPasajero>(this.resourceUrl, pasajero, { observe: 'response' });
  }

  update(pasajero: IPasajero): Observable<EntityResponseType> {
    return this.http.put<IPasajero>(`${this.resourceUrl}/${getPasajeroIdentifier(pasajero) as number}`, pasajero, { observe: 'response' });
  }

  partialUpdate(pasajero: IPasajero): Observable<EntityResponseType> {
    return this.http.patch<IPasajero>(`${this.resourceUrl}/${getPasajeroIdentifier(pasajero) as number}`, pasajero, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPasajero>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPasajero[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPasajeroToCollectionIfMissing(pasajeroCollection: IPasajero[], ...pasajerosToCheck: (IPasajero | null | undefined)[]): IPasajero[] {
    const pasajeros: IPasajero[] = pasajerosToCheck.filter(isPresent);
    if (pasajeros.length > 0) {
      const pasajeroCollectionIdentifiers = pasajeroCollection.map(pasajeroItem => getPasajeroIdentifier(pasajeroItem)!);
      const pasajerosToAdd = pasajeros.filter(pasajeroItem => {
        const pasajeroIdentifier = getPasajeroIdentifier(pasajeroItem);
        if (pasajeroIdentifier == null || pasajeroCollectionIdentifiers.includes(pasajeroIdentifier)) {
          return false;
        }
        pasajeroCollectionIdentifiers.push(pasajeroIdentifier);
        return true;
      });
      return [...pasajerosToAdd, ...pasajeroCollection];
    }
    return pasajeroCollection;
  }
}
