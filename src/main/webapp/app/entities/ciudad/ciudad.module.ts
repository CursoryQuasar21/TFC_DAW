import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CiudadComponent } from './list/ciudad.component';
import { CiudadDetailComponent } from './detail/ciudad-detail.component';
import { CiudadUpdateComponent } from './update/ciudad-update.component';
import { CiudadDeleteDialogComponent } from './delete/ciudad-delete-dialog.component';
import { CiudadRoutingModule } from './route/ciudad-routing.module';

@NgModule({
  imports: [SharedModule, CiudadRoutingModule],
  declarations: [CiudadComponent, CiudadDetailComponent, CiudadUpdateComponent, CiudadDeleteDialogComponent],
  entryComponents: [CiudadDeleteDialogComponent],
})
export class CiudadModule {}
