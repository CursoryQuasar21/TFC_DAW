import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { VueloComponent } from './list/vuelo.component';
import { VueloDetailComponent } from './detail/vuelo-detail.component';
import { VueloUpdateComponent } from './update/vuelo-update.component';
import { VueloDeleteDialogComponent } from './delete/vuelo-delete-dialog.component';
import { VueloRoutingModule } from './route/vuelo-routing.module';

import { FormsModule } from '@angular/forms';
import { FilterVuelosPipe } from 'app/pipes/filter/entities/vuelo/filter-vuelos.pipe';
@NgModule({
  imports: [SharedModule, VueloRoutingModule, FormsModule],
  declarations: [VueloComponent, VueloDetailComponent, VueloUpdateComponent, VueloDeleteDialogComponent, FilterVuelosPipe],
  entryComponents: [VueloDeleteDialogComponent],
})
export class VueloModule {}
