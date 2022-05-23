import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PaisComponent } from './list/pais.component';
import { PaisDetailComponent } from './detail/pais-detail.component';
import { PaisUpdateComponent } from './update/pais-update.component';
import { PaisDeleteDialogComponent } from './delete/pais-delete-dialog.component';
import { PaisRoutingModule } from './route/pais-routing.module';

import { FormsModule } from '@angular/forms';
import { FilterPaisesPipe } from 'app/pipes/filter/entities/pais/filter-paises.pipe';
@NgModule({
  imports: [SharedModule, PaisRoutingModule, FormsModule],
  declarations: [PaisComponent, PaisDetailComponent, PaisUpdateComponent, PaisDeleteDialogComponent, FilterPaisesPipe],
  entryComponents: [PaisDeleteDialogComponent],
})
export class PaisModule {}
