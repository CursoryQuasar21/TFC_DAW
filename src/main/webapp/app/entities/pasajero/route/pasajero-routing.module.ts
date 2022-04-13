import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PasajeroComponent } from '../list/pasajero.component';
import { PasajeroDetailComponent } from '../detail/pasajero-detail.component';
import { PasajeroUpdateComponent } from '../update/pasajero-update.component';
import { PasajeroRoutingResolveService } from './pasajero-routing-resolve.service';

const pasajeroRoute: Routes = [
  {
    path: '',
    component: PasajeroComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PasajeroDetailComponent,
    resolve: {
      pasajero: PasajeroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PasajeroUpdateComponent,
    resolve: {
      pasajero: PasajeroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PasajeroUpdateComponent,
    resolve: {
      pasajero: PasajeroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pasajeroRoute)],
  exports: [RouterModule],
})
export class PasajeroRoutingModule {}
