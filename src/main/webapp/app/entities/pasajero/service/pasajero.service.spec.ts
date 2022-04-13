import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPasajero, Pasajero } from '../pasajero.model';

import { PasajeroService } from './pasajero.service';

describe('Service Tests', () => {
  describe('Pasajero Service', () => {
    let service: PasajeroService;
    let httpMock: HttpTestingController;
    let elemDefault: IPasajero;
    let expectedResult: IPasajero | IPasajero[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PasajeroService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nombre: 'AAAAAAA',
        apellidos: 'AAAAAAA',
        pasaporte: 'AAAAAAA',
        cantidadEquipaje: 0,
        numeroAsiento: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Pasajero', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Pasajero()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Pasajero', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombre: 'BBBBBB',
            apellidos: 'BBBBBB',
            pasaporte: 'BBBBBB',
            cantidadEquipaje: 1,
            numeroAsiento: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Pasajero', () => {
        const patchObject = Object.assign(
          {
            apellidos: 'BBBBBB',
            numeroAsiento: 1,
          },
          new Pasajero()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Pasajero', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombre: 'BBBBBB',
            apellidos: 'BBBBBB',
            pasaporte: 'BBBBBB',
            cantidadEquipaje: 1,
            numeroAsiento: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Pasajero', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPasajeroToCollectionIfMissing', () => {
        it('should add a Pasajero to an empty array', () => {
          const pasajero: IPasajero = { id: 123 };
          expectedResult = service.addPasajeroToCollectionIfMissing([], pasajero);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(pasajero);
        });

        it('should not add a Pasajero to an array that contains it', () => {
          const pasajero: IPasajero = { id: 123 };
          const pasajeroCollection: IPasajero[] = [
            {
              ...pasajero,
            },
            { id: 456 },
          ];
          expectedResult = service.addPasajeroToCollectionIfMissing(pasajeroCollection, pasajero);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Pasajero to an array that doesn't contain it", () => {
          const pasajero: IPasajero = { id: 123 };
          const pasajeroCollection: IPasajero[] = [{ id: 456 }];
          expectedResult = service.addPasajeroToCollectionIfMissing(pasajeroCollection, pasajero);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(pasajero);
        });

        it('should add only unique Pasajero to an array', () => {
          const pasajeroArray: IPasajero[] = [{ id: 123 }, { id: 456 }, { id: 32046 }];
          const pasajeroCollection: IPasajero[] = [{ id: 123 }];
          expectedResult = service.addPasajeroToCollectionIfMissing(pasajeroCollection, ...pasajeroArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const pasajero: IPasajero = { id: 123 };
          const pasajero2: IPasajero = { id: 456 };
          expectedResult = service.addPasajeroToCollectionIfMissing([], pasajero, pasajero2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(pasajero);
          expect(expectedResult).toContain(pasajero2);
        });

        it('should accept null and undefined values', () => {
          const pasajero: IPasajero = { id: 123 };
          expectedResult = service.addPasajeroToCollectionIfMissing([], null, pasajero, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(pasajero);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
