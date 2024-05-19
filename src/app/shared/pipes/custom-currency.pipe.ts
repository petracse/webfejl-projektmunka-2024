import {Injectable, Pipe, PipeTransform} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'EUR'): string {
    // Konfigurálhatod a pénznem formátumát saját módon
    const currencySymbols: any = {
      'EUR': '€',
      'USD': '$',
      'HUF': 'Ft'
    };

    const currencySymbol: string = currencySymbols[currencyCode] || currencyCode;

    const formattedValue: string = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    return `${formattedValue} ${currencySymbol}`;
  }

}
