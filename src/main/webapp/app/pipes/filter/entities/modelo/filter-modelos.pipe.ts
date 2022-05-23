import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterModelos',
})
export class FilterModelosPipe implements PipeTransform {
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
          case 'motores': {
            if (
              args[0][2] !== undefined &&
              args[0][2] !== null &&
              element.motores.toString().toLowerCase().indexOf(args[0][2].toString().toLowerCase()) > -1
            ) {
              contArgs++;
            }
            break;
          }
          case 'cantidadPilotos': {
            if (
              args[0][3] !== undefined &&
              args[0][3] !== null &&
              element.cantidadPilotos.toString().toLowerCase().indexOf(args[0][3].toString().toLowerCase()) > -1
            ) {
              contArgs++;
            }
            break;
          }
          case 'cantidadTripulantes': {
            if (
              args[0][4] !== undefined &&
              args[0][4] !== null &&
              element.cantidadTripulantes.toString().toLowerCase().indexOf(args[0][4].toString().toLowerCase()) > -1
            ) {
              contArgs++;
            }
            break;
          }
          case 'cantidadPasajeros': {
            if (
              args[0][5] !== undefined &&
              args[0][5] !== null &&
              element.cantidadPasajeros.toString().toLowerCase().indexOf(args[0][5].toString().toLowerCase()) > -1
            ) {
              contArgs++;
            }
            break;
          }
          case 'cantidadEquipajes': {
            if (
              args[0][6] !== undefined &&
              args[0][6] !== null &&
              element.cantidadEquipajes.toString().toLowerCase().indexOf(args[0][6].toString().toLowerCase()) > -1
            ) {
              contArgs++;
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
