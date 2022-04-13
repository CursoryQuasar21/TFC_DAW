import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICiudad } from '../ciudad.model';

@Component({
  selector: 'jhi-ciudad-detail',
  templateUrl: './ciudad-detail.component.html',
})
export class CiudadDetailComponent implements OnInit {
  ciudad: ICiudad | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ciudad }) => {
      this.ciudad = ciudad;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
