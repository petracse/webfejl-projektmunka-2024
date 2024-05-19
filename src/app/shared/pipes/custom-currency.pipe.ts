import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(targetCurrencyCode: string, value: number = 10, sourceCurrencyCode: string = 'EUR'): string {
    const currencySymbols: any = {
      'EUR': '€',
      'USD': '$',
      'HUF': 'Ft'
    };

    const currencyRates: any = {
      'EUR': {
        'USD': 1.22,
        'HUF': 387,
        'EUR': 1
      },
      'USD': {
        'EUR': 0.82,
        'HUF': 356
      },
      'HUF': {
        'EUR': 0.0026,
        'USD': 0.0028
      }
    };

    const currencySymbol: string = currencySymbols[targetCurrencyCode] || targetCurrencyCode;

    const convertedValue: number = value / currencyRates[sourceCurrencyCode][targetCurrencyCode];

    const formattedValue: string = convertedValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    return `${formattedValue} ${currencySymbol}`;
  }
}
