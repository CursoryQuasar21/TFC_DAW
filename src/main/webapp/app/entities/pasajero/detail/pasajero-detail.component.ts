import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPasajero } from '../pasajero.model';

@Component({
  selector: 'jhi-pasajero-detail',
  templateUrl: './pasajero-detail.component.html',
})
export class PasajeroDetailComponent implements OnInit {
  pasajero: IPasajero | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pasajero }) => {
      this.pasajero = pasajero;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
