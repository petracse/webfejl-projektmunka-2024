import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrencyPipe'
})
export class CustomCurrencyPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
