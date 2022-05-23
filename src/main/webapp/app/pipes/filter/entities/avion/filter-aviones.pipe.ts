import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAviones',
})
export class FilterAvionesPipe implements PipeTransform {
  transform(value: any, atributos: any[], ...args: any): any {
    const resultados: unknown[] = [];
    // console.log(value);
    // console.log(atributos);
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
      for (const campo of atributos) {
        switch (campo) {
          case 'id': {
            if (args[0][0] !== undefined && args[0][0] !== null && element.id.toString().indexOf(args[0][0].toString()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'costeFabricacion': {
            let min = 0;
            let max = 999999999999999;
            if (args[0][1] !== undefined && args[0][1] !== null) {
              min = args[0][1];
            }
            if (args[0][2] !== undefined && args[0][2] !== null) {
              max = args[0][2];
            }
            if (min <= element.costeFabricacion && element.costeFabricacion <= max) {
              contArgs++;
              contArgs++;
            }
            break;
          }
          case 'anioFabricacion': {
            let fechaOrigen = new Date(1970, 1, 1);
            let fechaFinal = new Date();
            if (args[0][3] !== undefined && args[0][3] !== null) {
              fechaOrigen = new Date(args[0][3]);
            }
            if (args[0][4] !== undefined && args[0][4] !== null) {
              fechaFinal = new Date(args[0][4]);
            }
            if (
              fechaOrigen.getTime() <= new Date(element.anioFabricacion).getTime() &&
              new Date(element.anioFabricacion).getTime() <= fechaFinal.getTime()
            ) {
              contArgs++;
              contArgs++;
            }
            break;
          }
          case 'modelo': {
            if (element.modelo !== undefined && element.modelo !== null) {
              if (
                args[0][5] !== undefined &&
                args[0][5] !== null &&
                element.modelo.id.toString().toLowerCase().indexOf(args[0][5].toString().toLowerCase()) > -1
              ) {
                contArgs++;
              }
            }

            break;
          }
          case 'aeropuerto': {
            if (element.aeropuerto !== undefined && element.aeropuerto !== null) {
              if (
                args[0][6] !== undefined &&
                args[0][6] !== null &&
                element.aeropuerto.id.toString().toLowerCase().indexOf(args[0][6].toString().toLowerCase()) > -1
              ) {
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
    let cont2 = 0;
    for (const element of array[0]) {
      if (cont2 < 1 || cont2 > 4) {
        if (element !== null && element !== undefined && element.toString() !== '') {
          cont++;
        }
      } else {
        cont++;
      }
      cont2++;
    }
    return cont;
  }
}
