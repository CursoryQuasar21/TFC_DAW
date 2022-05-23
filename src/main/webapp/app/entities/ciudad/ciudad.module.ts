import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CiudadComponent } from './list/ciudad.component';
import { CiudadDetailComponent } from './detail/ciudad-detail.component';
import { CiudadUpdateComponent } from './update/ciudad-update.component';
import { CiudadDeleteDialogComponent } from './delete/ciudad-delete-dialog.component';
import { CiudadRoutingModule } from './route/ciudad-routing.module';

import { FormsModule } from '@angular/forms';
import { FilterCiudadesPipe } from 'app/pipes/filter/entities/ciudad/filter-ciudades.pipe';

@NgModule({
  imports: [SharedModule, CiudadRoutingModule, FormsModule],
  declarations: [CiudadComponent, CiudadDetailComponent, CiudadUpdateComponent, CiudadDeleteDialogComponent, FilterCiudadesPipe],
  entryComponents: [CiudadDeleteDialogComponent],
})
export class CiudadModule {}
