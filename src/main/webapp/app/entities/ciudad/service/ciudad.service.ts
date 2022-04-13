import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICiudad, getCiudadIdentifier } from '../ciudad.model';

export type EntityResponseType = HttpResponse<ICiudad>;
export type EntityArrayResponseType = HttpResponse<ICiudad[]>;

@Injectable({ providedIn: 'root' })
export class CiudadService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/ciudads');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(ciudad: ICiudad): Observable<EntityResponseType> {
    return this.http.post<ICiudad>(this.resourceUrl, ciudad, { observe: 'response' });
  }

  update(ciudad: ICiudad): Observable<EntityResponseType> {
    return this.http.put<ICiudad>(`${this.resourceUrl}/${getCiudadIdentifier(ciudad) as number}`, ciudad, { observe: 'response' });
  }

  partialUpdate(ciudad: ICiudad): Observable<EntityResponseType> {
    return this.http.patch<ICiudad>(`${this.resourceUrl}/${getCiudadIdentifier(ciudad) as number}`, ciudad, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICiudad>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICiudad[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCiudadToCollectionIfMissing(ciudadCollection: ICiudad[], ...ciudadsToCheck: (ICiudad | null | undefined)[]): ICiudad[] {
    const ciudads: ICiudad[] = ciudadsToCheck.filter(isPresent);
    if (ciudads.length > 0) {
      const ciudadCollectionIdentifiers = ciudadCollection.map(ciudadItem => getCiudadIdentifier(ciudadItem)!);
      const ciudadsToAdd = ciudads.filter(ciudadItem => {
        const ciudadIdentifier = getCiudadIdentifier(ciudadItem);
        if (ciudadIdentifier == null || ciudadCollectionIdentifiers.includes(ciudadIdentifier)) {
          return false;
        }
        ciudadCollectionIdentifiers.push(ciudadIdentifier);
        return true;
      });
      return [...ciudadsToAdd, ...ciudadCollection];
    }
    return ciudadCollection;
  }
}
