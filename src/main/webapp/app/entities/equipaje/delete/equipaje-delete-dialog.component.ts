import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEquipaje } from '../equipaje.model';
import { EquipajeService } from '../service/equipaje.service';

@Component({
  templateUrl: './equipaje-delete-dialog.component.html',
})
export class EquipajeDeleteDialogComponent {
  equipaje?: IEquipaje;

  constructor(protected equipajeService: EquipajeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.equipajeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
