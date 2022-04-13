import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PasajeroComponent } from './list/pasajero.component';
import { PasajeroDetailComponent } from './detail/pasajero-detail.component';
import { PasajeroUpdateComponent } from './update/pasajero-update.component';
import { PasajeroDeleteDialogComponent } from './delete/pasajero-delete-dialog.component';
import { PasajeroRoutingModule } from './route/pasajero-routing.module';

@NgModule({
  imports: [SharedModule, PasajeroRoutingModule],
  declarations: [PasajeroComponent, PasajeroDetailComponent, PasajeroUpdateComponent, PasajeroDeleteDialogComponent],
  entryComponents: [PasajeroDeleteDialogComponent],
})
export class PasajeroModule {}
