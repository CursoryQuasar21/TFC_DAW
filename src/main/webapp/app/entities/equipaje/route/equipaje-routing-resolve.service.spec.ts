jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEquipaje, Equipaje } from '../equipaje.model';
import { EquipajeService } from '../service/equipaje.service';

import { EquipajeRoutingResolveService } from './equipaje-routing-resolve.service';

describe('Service Tests', () => {
  describe('Equipaje routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EquipajeRoutingResolveService;
    let service: EquipajeService;
    let resultEquipaje: IEquipaje | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EquipajeRoutingResolveService);
      service = TestBed.inject(EquipajeService);
      resultEquipaje = undefined;
    });

    describe('resolve', () => {
      it('should return IEquipaje returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEquipaje = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEquipaje).toEqual({ id: 123 });
      });

      it('should return new IEquipaje if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEquipaje = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEquipaje).toEqual(new Equipaje());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEquipaje = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEquipaje).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
