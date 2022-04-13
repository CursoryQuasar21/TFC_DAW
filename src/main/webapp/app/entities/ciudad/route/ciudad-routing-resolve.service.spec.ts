jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICiudad, Ciudad } from '../ciudad.model';
import { CiudadService } from '../service/ciudad.service';

import { CiudadRoutingResolveService } from './ciudad-routing-resolve.service';

describe('Service Tests', () => {
  describe('Ciudad routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CiudadRoutingResolveService;
    let service: CiudadService;
    let resultCiudad: ICiudad | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CiudadRoutingResolveService);
      service = TestBed.inject(CiudadService);
      resultCiudad = undefined;
    });

    describe('resolve', () => {
      it('should return ICiudad returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCiudad = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCiudad).toEqual({ id: 123 });
      });

      it('should return new ICiudad if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCiudad = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCiudad).toEqual(new Ciudad());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCiudad = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCiudad).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
