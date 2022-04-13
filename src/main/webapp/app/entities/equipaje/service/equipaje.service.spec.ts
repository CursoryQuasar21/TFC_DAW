import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEquipaje, Equipaje } from '../equipaje.model';

import { EquipajeService } from './equipaje.service';

describe('Service Tests', () => {
  describe('Equipaje Service', () => {
    let service: EquipajeService;
    let httpMock: HttpTestingController;
    let elemDefault: IEquipaje;
    let expectedResult: IEquipaje | IEquipaje[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EquipajeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        tipo: 'AAAAAAA',
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

      it('should create a Equipaje', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Equipaje()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Equipaje', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            tipo: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Equipaje', () => {
        const patchObject = Object.assign(
          {
            tipo: 'BBBBBB',
          },
          new Equipaje()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Equipaje', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            tipo: 'BBBBBB',
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

      it('should delete a Equipaje', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEquipajeToCollectionIfMissing', () => {
        it('should add a Equipaje to an empty array', () => {
          const equipaje: IEquipaje = { id: 123 };
          expectedResult = service.addEquipajeToCollectionIfMissing([], equipaje);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(equipaje);
        });

        it('should not add a Equipaje to an array that contains it', () => {
          const equipaje: IEquipaje = { id: 123 };
          const equipajeCollection: IEquipaje[] = [
            {
              ...equipaje,
            },
            { id: 456 },
          ];
          expectedResult = service.addEquipajeToCollectionIfMissing(equipajeCollection, equipaje);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Equipaje to an array that doesn't contain it", () => {
          const equipaje: IEquipaje = { id: 123 };
          const equipajeCollection: IEquipaje[] = [{ id: 456 }];
          expectedResult = service.addEquipajeToCollectionIfMissing(equipajeCollection, equipaje);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(equipaje);
        });

        it('should add only unique Equipaje to an array', () => {
          const equipajeArray: IEquipaje[] = [{ id: 123 }, { id: 456 }, { id: 58541 }];
          const equipajeCollection: IEquipaje[] = [{ id: 123 }];
          expectedResult = service.addEquipajeToCollectionIfMissing(equipajeCollection, ...equipajeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const equipaje: IEquipaje = { id: 123 };
          const equipaje2: IEquipaje = { id: 456 };
          expectedResult = service.addEquipajeToCollectionIfMissing([], equipaje, equipaje2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(equipaje);
          expect(expectedResult).toContain(equipaje2);
        });

        it('should accept null and undefined values', () => {
          const equipaje: IEquipaje = { id: 123 };
          expectedResult = service.addEquipajeToCollectionIfMissing([], null, equipaje, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(equipaje);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
