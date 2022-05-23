import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TripulanteComponent } from './list/tripulante.component';
import { TripulanteDetailComponent } from './detail/tripulante-detail.component';
import { TripulanteUpdateComponent } from './update/tripulante-update.component';
import { TripulanteDeleteDialogComponent } from './delete/tripulante-delete-dialog.component';
import { TripulanteRoutingModule } from './route/tripulante-routing.module';

import { FormsModule } from '@angular/forms';
import { FilterTripulantesPipe } from 'app/pipes/filter/entities/tripulante/filter-tripulantes.pipe';
@NgModule({
  imports: [SharedModule, TripulanteRoutingModule, FormsModule],
  declarations: [
    TripulanteComponent,
    TripulanteDetailComponent,
    TripulanteUpdateComponent,
    TripulanteDeleteDialogComponent,
    FilterTripulantesPipe,
  ],
  entryComponents: [TripulanteDeleteDialogComponent],
})
export class TripulanteModule {}
