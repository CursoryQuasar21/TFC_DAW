import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PilotoComponent } from './list/piloto.component';
import { PilotoDetailComponent } from './detail/piloto-detail.component';
import { PilotoUpdateComponent } from './update/piloto-update.component';
import { PilotoDeleteDialogComponent } from './delete/piloto-delete-dialog.component';
import { PilotoRoutingModule } from './route/piloto-routing.module';

import { FormsModule } from '@angular/forms';
import { FilterPilotosPipe } from 'app/pipes/filter/entities/piloto/filter-pilotos.pipe';
@NgModule({
  imports: [SharedModule, PilotoRoutingModule, FormsModule],
  declarations: [PilotoComponent, PilotoDetailComponent, PilotoUpdateComponent, PilotoDeleteDialogComponent, FilterPilotosPipe],
  entryComponents: [PilotoDeleteDialogComponent],
})
export class PilotoModule {}
