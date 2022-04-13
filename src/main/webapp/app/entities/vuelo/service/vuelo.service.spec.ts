import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVuelo, Vuelo } from '../vuelo.model';

import { VueloService } from './vuelo.service';

describe('Service Tests', () => {
  describe('Vuelo Service', () => {
    let service: VueloService;
    let httpMock: HttpTestingController;
    let elemDefault: IVuelo;
    let expectedResult: IVuelo | IVuelo[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VueloService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        fechaOrigen: currentDate,
        fechaDestino: currentDate,
        precio: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fechaOrigen: currentDate.format(DATE_TIME_FORMAT),
            fechaDestino: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Vuelo', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fechaOrigen: currentDate.format(DATE_TIME_FORMAT),
            fechaDestino: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaOrigen: currentDate,
            fechaDestino: currentDate,
          },
          returnedFromService
        );

        service.create(new Vuelo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Vuelo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            fechaOrigen: currentDate.format(DATE_TIME_FORMAT),
            fechaDestino: currentDate.format(DATE_TIME_FORMAT),
            precio: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaOrigen: currentDate,
            fechaDestino: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Vuelo', () => {
        const patchObject = Object.assign(
          {
            fechaOrigen: currentDate.format(DATE_TIME_FORMAT),
            precio: 1,
          },
          new Vuelo()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            fechaOrigen: currentDate,
            fechaDestino: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Vuelo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            fechaOrigen: currentDate.format(DATE_TIME_FORMAT),
            fechaDestino: currentDate.format(DATE_TIME_FORMAT),
            precio: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaOrigen: currentDate,
            fechaDestino: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Vuelo', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVueloToCollectionIfMissing', () => {
        it('should add a Vuelo to an empty array', () => {
          const vuelo: IVuelo = { id: 123 };
          expectedResult = service.addVueloToCollectionIfMissing([], vuelo);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vuelo);
        });

        it('should not add a Vuelo to an array that contains it', () => {
          const vuelo: IVuelo = { id: 123 };
          const vueloCollection: IVuelo[] = [
            {
              ...vuelo,
            },
            { id: 456 },
          ];
          expectedResult = service.addVueloToCollectionIfMissing(vueloCollection, vuelo);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Vuelo to an array that doesn't contain it", () => {
          const vuelo: IVuelo = { id: 123 };
          const vueloCollection: IVuelo[] = [{ id: 456 }];
          expectedResult = service.addVueloToCollectionIfMissing(vueloCollection, vuelo);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vuelo);
        });

        it('should add only unique Vuelo to an array', () => {
          const vueloArray: IVuelo[] = [{ id: 123 }, { id: 456 }, { id: 63064 }];
          const vueloCollection: IVuelo[] = [{ id: 123 }];
          expectedResult = service.addVueloToCollectionIfMissing(vueloCollection, ...vueloArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const vuelo: IVuelo = { id: 123 };
          const vuelo2: IVuelo = { id: 456 };
          expectedResult = service.addVueloToCollectionIfMissing([], vuelo, vuelo2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vuelo);
          expect(expectedResult).toContain(vuelo2);
        });

        it('should accept null and undefined values', () => {
          const vuelo: IVuelo = { id: 123 };
          expectedResult = service.addVueloToCollectionIfMissing([], null, vuelo, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vuelo);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
