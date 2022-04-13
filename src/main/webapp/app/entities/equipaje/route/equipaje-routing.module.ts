import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EquipajeComponent } from '../list/equipaje.component';
import { EquipajeDetailComponent } from '../detail/equipaje-detail.component';
import { EquipajeUpdateComponent } from '../update/equipaje-update.component';
import { EquipajeRoutingResolveService } from './equipaje-routing-resolve.service';

const equipajeRoute: Routes = [
  {
    path: '',
    component: EquipajeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EquipajeDetailComponent,
    resolve: {
      equipaje: EquipajeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EquipajeUpdateComponent,
    resolve: {
      equipaje: EquipajeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EquipajeUpdateComponent,
    resolve: {
      equipaje: EquipajeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(equipajeRoute)],
  exports: [RouterModule],
})
export class EquipajeRoutingModule {}
