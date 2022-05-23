import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCiudades',
})
export class FilterCiudadesPipe implements PipeTransform {
  transform(value: any, atri: any[], ...args: any): any {
    const resultados: unknown[] = [];
    // console.log(value);
    // console.log(atri);
    // console.log(args);
    const longitudArray = this.longitudRealArray(args);
    if (longitudArray === 0) {
      for (const element of value) {
        resultados.push(element);
      }
      return resultados;
    }
    for (const element of value) {
      let contArgs = 0;
      for (const campo of atri) {
        switch (campo) {
          case 'id': {
            if (args[0][0] !== undefined && args[0][0] !== null && element.id.toString().indexOf(args[0][0].toString()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'nombre': {
            if (args[0][1] !== undefined && element.nombre.toLowerCase().indexOf(args[0][1].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'pais': {
            if (element.pais !== undefined && element.pais !== null) {
              if (args[0][2] !== undefined && args[0][2] !== null && element.pais.id.toString().indexOf(args[0][2].toString()) > -1) {
                contArgs++;
              }
            }
            break;
          }
        }
      }
      if (longitudArray === contArgs) {
        resultados.push(element);
      }
    }
    return resultados;
  }

  longitudRealArray(array: any): number {
    let cont = 0;
    for (const element of array[0]) {
      if (element !== null && element !== undefined && element.toString() !== '') {
        cont++;
      }
    }
    return cont;
  }
}
