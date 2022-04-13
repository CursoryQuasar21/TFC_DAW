import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'piloto',
        data: { pageTitle: 'tfcDawApp.piloto.home.title' },
        loadChildren: () => import('./piloto/piloto.module').then(m => m.PilotoModule),
      },
      {
        path: 'tripulante',
        data: { pageTitle: 'tfcDawApp.tripulante.home.title' },
        loadChildren: () => import('./tripulante/tripulante.module').then(m => m.TripulanteModule),
      },
      {
        path: 'pasajero',
        data: { pageTitle: 'tfcDawApp.pasajero.home.title' },
        loadChildren: () => import('./pasajero/pasajero.module').then(m => m.PasajeroModule),
      },
      {
        path: 'equipaje',
        data: { pageTitle: 'tfcDawApp.equipaje.home.title' },
        loadChildren: () => import('./equipaje/equipaje.module').then(m => m.EquipajeModule),
      },
      {
        path: 'avion',
        data: { pageTitle: 'tfcDawApp.avion.home.title' },
        loadChildren: () => import('./avion/avion.module').then(m => m.AvionModule),
      },
      {
        path: 'modelo',
        data: { pageTitle: 'tfcDawApp.modelo.home.title' },
        loadChildren: () => import('./modelo/modelo.module').then(m => m.ModeloModule),
      },
      {
        path: 'vuelo',
        data: { pageTitle: 'tfcDawApp.vuelo.home.title' },
        loadChildren: () => import('./vuelo/vuelo.module').then(m => m.VueloModule),
      },
      {
        path: 'aeropuerto',
        data: { pageTitle: 'tfcDawApp.aeropuerto.home.title' },
        loadChildren: () => import('./aeropuerto/aeropuerto.module').then(m => m.AeropuertoModule),
      },
      {
        path: 'ciudad',
        data: { pageTitle: 'tfcDawApp.ciudad.home.title' },
        loadChildren: () => import('./ciudad/ciudad.module').then(m => m.CiudadModule),
      },
      {
        path: 'pais',
        data: { pageTitle: 'tfcDawApp.pais.home.title' },
        loadChildren: () => import('./pais/pais.module').then(m => m.PaisModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
