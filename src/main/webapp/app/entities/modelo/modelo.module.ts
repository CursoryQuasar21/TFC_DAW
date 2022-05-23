import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ModeloComponent } from './list/modelo.component';
import { ModeloDetailComponent } from './detail/modelo-detail.component';
import { ModeloUpdateComponent } from './update/modelo-update.component';
import { ModeloDeleteDialogComponent } from './delete/modelo-delete-dialog.component';
import { ModeloRoutingModule } from './route/modelo-routing.module';

import { FormsModule } from '@angular/forms';
import { FilterModelosPipe } from 'app/pipes/filter/entities/modelo/filter-modelos.pipe';
@NgModule({
  imports: [SharedModule, ModeloRoutingModule, FormsModule],
  declarations: [ModeloComponent, ModeloDetailComponent, ModeloUpdateComponent, ModeloDeleteDialogComponent, FilterModelosPipe],
  entryComponents: [ModeloDeleteDialogComponent],
})
export class ModeloModule {}
