import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPasajeros',
})
export class FilterPasajerosPipe implements PipeTransform {
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
            if (args[0][1] !== undefined && args[0][1] !== null && element.nombre.toLowerCase().indexOf(args[0][1].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'apellidos': {
            if (args[0][2] !== undefined && args[0][2] !== null && element.apellidos.toLowerCase().indexOf(args[0][2].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'pasaporte': {
            if (args[0][3] !== undefined && args[0][3] !== null && element.pasaporte.toLowerCase().indexOf(args[0][3].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'cantidadEquipaje': {
            if (
              args[0][4] !== undefined &&
              args[0][4] !== null &&
              element.cantidadEquipaje.toString().indexOf(args[0][4].toString()) > -1
            ) {
              contArgs++;
            }
            break;
          }
          case 'numeroAsiento': {
            if (args[0][5] !== undefined && args[0][5] !== null && element.numeroAsiento.toString().indexOf(args[0][5].toString()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'avion': {
            if (element.avion !== undefined && element.avion !== null) {
              if (args[0][6] !== undefined && args[0][6] !== null && element.avion.id.toString().indexOf(args[0][6].toString()) > -1) {
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
