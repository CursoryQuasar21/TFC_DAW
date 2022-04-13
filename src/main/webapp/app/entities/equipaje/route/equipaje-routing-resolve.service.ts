import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEquipaje, Equipaje } from '../equipaje.model';
import { EquipajeService } from '../service/equipaje.service';

@Injectable({ providedIn: 'root' })
export class EquipajeRoutingResolveService implements Resolve<IEquipaje> {
  constructor(protected service: EquipajeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEquipaje> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((equipaje: HttpResponse<Equipaje>) => {
          if (equipaje.body) {
            return of(equipaje.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Equipaje());
  }
}
