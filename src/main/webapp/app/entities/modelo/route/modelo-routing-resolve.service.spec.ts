jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IModelo, Modelo } from '../modelo.model';
import { ModeloService } from '../service/modelo.service';

import { ModeloRoutingResolveService } from './modelo-routing-resolve.service';

describe('Service Tests', () => {
  describe('Modelo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ModeloRoutingResolveService;
    let service: ModeloService;
    let resultModelo: IModelo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ModeloRoutingResolveService);
      service = TestBed.inject(ModeloService);
      resultModelo = undefined;
    });

    describe('resolve', () => {
      it('should return IModelo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultModelo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultModelo).toEqual({ id: 123 });
      });

      it('should return new IModelo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultModelo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultModelo).toEqual(new Modelo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultModelo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultModelo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
