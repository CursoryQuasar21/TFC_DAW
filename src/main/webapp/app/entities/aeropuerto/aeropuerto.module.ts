import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AeropuertoComponent } from './list/aeropuerto.component';
import { AeropuertoDetailComponent } from './detail/aeropuerto-detail.component';
import { AeropuertoUpdateComponent } from './update/aeropuerto-update.component';
import { AeropuertoDeleteDialogComponent } from './delete/aeropuerto-delete-dialog.component';
import { AeropuertoRoutingModule } from './route/aeropuerto-routing.module';

import { FilterAeropuertosPipe } from 'app/pipes/filter/entities/aeropuerto/filter-aeropuertos.pipe';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [SharedModule, AeropuertoRoutingModule, FormsModule],
  declarations: [
    AeropuertoComponent,
    AeropuertoDetailComponent,
    AeropuertoUpdateComponent,
    AeropuertoDeleteDialogComponent,
    FilterAeropuertosPipe,
  ],
  entryComponents: [AeropuertoDeleteDialogComponent],
})
export class AeropuertoModule {}
