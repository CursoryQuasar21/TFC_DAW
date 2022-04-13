jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPasajero, Pasajero } from '../pasajero.model';
import { PasajeroService } from '../service/pasajero.service';

import { PasajeroRoutingResolveService } from './pasajero-routing-resolve.service';

describe('Service Tests', () => {
  describe('Pasajero routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PasajeroRoutingResolveService;
    let service: PasajeroService;
    let resultPasajero: IPasajero | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PasajeroRoutingResolveService);
      service = TestBed.inject(PasajeroService);
      resultPasajero = undefined;
    });

    describe('resolve', () => {
      it('should return IPasajero returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPasajero = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPasajero).toEqual({ id: 123 });
      });

      it('should return new IPasajero if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPasajero = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPasajero).toEqual(new Pasajero());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPasajero = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPasajero).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
