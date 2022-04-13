import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPasajero } from '../pasajero.model';
import { PasajeroService } from '../service/pasajero.service';

@Component({
  templateUrl: './pasajero-delete-dialog.component.html',
})
export class PasajeroDeleteDialogComponent {
  pasajero?: IPasajero;

  constructor(protected pasajeroService: PasajeroService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pasajeroService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
