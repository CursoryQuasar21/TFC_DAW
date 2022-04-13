import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICiudad } from '../ciudad.model';
import { CiudadService } from '../service/ciudad.service';

@Component({
  templateUrl: './ciudad-delete-dialog.component.html',
})
export class CiudadDeleteDialogComponent {
  ciudad?: ICiudad;

  constructor(protected ciudadService: CiudadService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ciudadService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
