import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICiudad, Ciudad } from '../ciudad.model';

import { CiudadService } from './ciudad.service';

describe('Service Tests', () => {
  describe('Ciudad Service', () => {
    let service: CiudadService;
    let httpMock: HttpTestingController;
    let elemDefault: ICiudad;
    let expectedResult: ICiudad | ICiudad[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CiudadService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nombre: 'AAAAAAA',
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

      it('should create a Ciudad', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Ciudad()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Ciudad', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombre: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Ciudad', () => {
        const patchObject = Object.assign({}, new Ciudad());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Ciudad', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombre: 'BBBBBB',
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

      it('should delete a Ciudad', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCiudadToCollectionIfMissing', () => {
        it('should add a Ciudad to an empty array', () => {
          const ciudad: ICiudad = { id: 123 };
          expectedResult = service.addCiudadToCollectionIfMissing([], ciudad);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ciudad);
        });

        it('should not add a Ciudad to an array that contains it', () => {
          const ciudad: ICiudad = { id: 123 };
          const ciudadCollection: ICiudad[] = [
            {
              ...ciudad,
            },
            { id: 456 },
          ];
          expectedResult = service.addCiudadToCollectionIfMissing(ciudadCollection, ciudad);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Ciudad to an array that doesn't contain it", () => {
          const ciudad: ICiudad = { id: 123 };
          const ciudadCollection: ICiudad[] = [{ id: 456 }];
          expectedResult = service.addCiudadToCollectionIfMissing(ciudadCollection, ciudad);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ciudad);
        });

        it('should add only unique Ciudad to an array', () => {
          const ciudadArray: ICiudad[] = [{ id: 123 }, { id: 456 }, { id: 4565 }];
          const ciudadCollection: ICiudad[] = [{ id: 123 }];
          expectedResult = service.addCiudadToCollectionIfMissing(ciudadCollection, ...ciudadArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const ciudad: ICiudad = { id: 123 };
          const ciudad2: ICiudad = { id: 456 };
          expectedResult = service.addCiudadToCollectionIfMissing([], ciudad, ciudad2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ciudad);
          expect(expectedResult).toContain(ciudad2);
        });

        it('should accept null and undefined values', () => {
          const ciudad: ICiudad = { id: 123 };
          expectedResult = service.addCiudadToCollectionIfMissing([], null, ciudad, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ciudad);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
