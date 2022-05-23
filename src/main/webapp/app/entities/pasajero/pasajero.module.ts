import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PasajeroComponent } from './list/pasajero.component';
import { PasajeroDetailComponent } from './detail/pasajero-detail.component';
import { PasajeroUpdateComponent } from './update/pasajero-update.component';
import { PasajeroDeleteDialogComponent } from './delete/pasajero-delete-dialog.component';
import { PasajeroRoutingModule } from './route/pasajero-routing.module';

import { FormsModule } from '@angular/forms';
import { FilterPasajerosPipe } from 'app/pipes/filter/entities/pasajero/filter-pasajeros.pipe';
@NgModule({
  imports: [SharedModule, PasajeroRoutingModule, FormsModule],
  declarations: [PasajeroComponent, PasajeroDetailComponent, PasajeroUpdateComponent, PasajeroDeleteDialogComponent, FilterPasajerosPipe],
  entryComponents: [PasajeroDeleteDialogComponent],
})
export class PasajeroModule {}
