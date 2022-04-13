import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EquipajeComponent } from './list/equipaje.component';
import { EquipajeDetailComponent } from './detail/equipaje-detail.component';
import { EquipajeUpdateComponent } from './update/equipaje-update.component';
import { EquipajeDeleteDialogComponent } from './delete/equipaje-delete-dialog.component';
import { EquipajeRoutingModule } from './route/equipaje-routing.module';

@NgModule({
  imports: [SharedModule, EquipajeRoutingModule],
  declarations: [EquipajeComponent, EquipajeDetailComponent, EquipajeUpdateComponent, EquipajeDeleteDialogComponent],
  entryComponents: [EquipajeDeleteDialogComponent],
})
export class EquipajeModule {}
