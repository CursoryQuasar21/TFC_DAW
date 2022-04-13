import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CiudadComponent } from '../list/ciudad.component';
import { CiudadDetailComponent } from '../detail/ciudad-detail.component';
import { CiudadUpdateComponent } from '../update/ciudad-update.component';
import { CiudadRoutingResolveService } from './ciudad-routing-resolve.service';

const ciudadRoute: Routes = [
  {
    path: '',
    component: CiudadComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CiudadDetailComponent,
    resolve: {
      ciudad: CiudadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CiudadUpdateComponent,
    resolve: {
      ciudad: CiudadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CiudadUpdateComponent,
    resolve: {
      ciudad: CiudadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ciudadRoute)],
  exports: [RouterModule],
})
export class CiudadRoutingModule {}
