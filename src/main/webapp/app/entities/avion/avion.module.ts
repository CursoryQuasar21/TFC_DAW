import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AvionComponent } from './list/avion.component';
import { AvionDetailComponent } from './detail/avion-detail.component';
import { AvionUpdateComponent } from './update/avion-update.component';
import { AvionDeleteDialogComponent } from './delete/avion-delete-dialog.component';
import { AvionRoutingModule } from './route/avion-routing.module';

import { FormsModule } from '@angular/forms';
import { FilterAvionesPipe } from 'app/pipes/filter/entities/avion/filter-aviones.pipe';
@NgModule({
  imports: [SharedModule, AvionRoutingModule, FormsModule],
  declarations: [AvionComponent, AvionDetailComponent, AvionUpdateComponent, AvionDeleteDialogComponent, FilterAvionesPipe],
  entryComponents: [AvionDeleteDialogComponent],
})
export class AvionModule {}
