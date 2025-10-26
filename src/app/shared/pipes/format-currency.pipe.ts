import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: number | undefined | null, currency: string = 'USD', locale: string = 'en-US'): string {
    if (value === undefined || value === null) {
      return '';
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  }
}
