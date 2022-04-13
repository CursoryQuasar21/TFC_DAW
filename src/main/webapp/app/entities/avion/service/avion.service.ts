import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAvion, getAvionIdentifier } from '../avion.model';

export type EntityResponseType = HttpResponse<IAvion>;
export type EntityArrayResponseType = HttpResponse<IAvion[]>;

@Injectable({ providedIn: 'root' })
export class AvionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/avions');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(avion: IAvion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avion);
    return this.http
      .post<IAvion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(avion: IAvion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avion);
    return this.http
      .put<IAvion>(`${this.resourceUrl}/${getAvionIdentifier(avion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(avion: IAvion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avion);
    return this.http
      .patch<IAvion>(`${this.resourceUrl}/${getAvionIdentifier(avion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAvion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAvion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAvionToCollectionIfMissing(avionCollection: IAvion[], ...avionsToCheck: (IAvion | null | undefined)[]): IAvion[] {
    const avions: IAvion[] = avionsToCheck.filter(isPresent);
    if (avions.length > 0) {
      const avionCollectionIdentifiers = avionCollection.map(avionItem => getAvionIdentifier(avionItem)!);
      const avionsToAdd = avions.filter(avionItem => {
        const avionIdentifier = getAvionIdentifier(avionItem);
        if (avionIdentifier == null || avionCollectionIdentifiers.includes(avionIdentifier)) {
          return false;
        }
        avionCollectionIdentifiers.push(avionIdentifier);
        return true;
      });
      return [...avionsToAdd, ...avionCollection];
    }
    return avionCollection;
  }

  protected convertDateFromClient(avion: IAvion): IAvion {
    return Object.assign({}, avion, {
      anioFabricacion: avion.anioFabricacion?.isValid() ? avion.anioFabricacion.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.anioFabricacion = res.body.anioFabricacion ? dayjs(res.body.anioFabricacion) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((avion: IAvion) => {
        avion.anioFabricacion = avion.anioFabricacion ? dayjs(avion.anioFabricacion) : undefined;
      });
    }
    return res;
  }
}
