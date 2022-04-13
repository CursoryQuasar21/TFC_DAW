import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVuelo, getVueloIdentifier } from '../vuelo.model';

export type EntityResponseType = HttpResponse<IVuelo>;
export type EntityArrayResponseType = HttpResponse<IVuelo[]>;

@Injectable({ providedIn: 'root' })
export class VueloService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/vuelos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(vuelo: IVuelo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vuelo);
    return this.http
      .post<IVuelo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(vuelo: IVuelo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vuelo);
    return this.http
      .put<IVuelo>(`${this.resourceUrl}/${getVueloIdentifier(vuelo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(vuelo: IVuelo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vuelo);
    return this.http
      .patch<IVuelo>(`${this.resourceUrl}/${getVueloIdentifier(vuelo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IVuelo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVuelo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVueloToCollectionIfMissing(vueloCollection: IVuelo[], ...vuelosToCheck: (IVuelo | null | undefined)[]): IVuelo[] {
    const vuelos: IVuelo[] = vuelosToCheck.filter(isPresent);
    if (vuelos.length > 0) {
      const vueloCollectionIdentifiers = vueloCollection.map(vueloItem => getVueloIdentifier(vueloItem)!);
      const vuelosToAdd = vuelos.filter(vueloItem => {
        const vueloIdentifier = getVueloIdentifier(vueloItem);
        if (vueloIdentifier == null || vueloCollectionIdentifiers.includes(vueloIdentifier)) {
          return false;
        }
        vueloCollectionIdentifiers.push(vueloIdentifier);
        return true;
      });
      return [...vuelosToAdd, ...vueloCollection];
    }
    return vueloCollection;
  }

  protected convertDateFromClient(vuelo: IVuelo): IVuelo {
    return Object.assign({}, vuelo, {
      fechaOrigen: vuelo.fechaOrigen?.isValid() ? vuelo.fechaOrigen.toJSON() : undefined,
      fechaDestino: vuelo.fechaDestino?.isValid() ? vuelo.fechaDestino.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaOrigen = res.body.fechaOrigen ? dayjs(res.body.fechaOrigen) : undefined;
      res.body.fechaDestino = res.body.fechaDestino ? dayjs(res.body.fechaDestino) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((vuelo: IVuelo) => {
        vuelo.fechaOrigen = vuelo.fechaOrigen ? dayjs(vuelo.fechaOrigen) : undefined;
        vuelo.fechaDestino = vuelo.fechaDestino ? dayjs(vuelo.fechaDestino) : undefined;
      });
    }
    return res;
  }
}
