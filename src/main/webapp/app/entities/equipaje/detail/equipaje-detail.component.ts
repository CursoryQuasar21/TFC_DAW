import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEquipaje } from '../equipaje.model';

@Component({
  selector: 'jhi-equipaje-detail',
  templateUrl: './equipaje-detail.component.html',
})
export class EquipajeDetailComponent implements OnInit {
  equipaje: IEquipaje | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipaje }) => {
      this.equipaje = equipaje;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
