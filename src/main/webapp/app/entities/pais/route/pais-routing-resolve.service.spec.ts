jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPais, Pais } from '../pais.model';
import { PaisService } from '../service/pais.service';

import { PaisRoutingResolveService } from './pais-routing-resolve.service';

describe('Service Tests', () => {
  describe('Pais routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PaisRoutingResolveService;
    let service: PaisService;
    let resultPais: IPais | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PaisRoutingResolveService);
      service = TestBed.inject(PaisService);
      resultPais = undefined;
    });

    describe('resolve', () => {
      it('should return IPais returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPais = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPais).toEqual({ id: 123 });
      });

      it('should return new IPais if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPais = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPais).toEqual(new Pais());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPais = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPais).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
