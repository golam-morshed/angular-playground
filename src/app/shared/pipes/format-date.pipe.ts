import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | undefined | null, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
    if (!value) {
      return '';
    }
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value; // Return original string if invalid date
    }
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(locale, options || defaultOptions);
  }
}
