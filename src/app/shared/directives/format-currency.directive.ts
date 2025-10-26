import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appFormatCurrency]'
})
export class FormatCurrencyDirective implements OnInit, OnChanges {
  @Input() appFormatCurrency: number | null = null;
  @Input() currency: string = 'USD';
  @Input() locale: string = 'en-US';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.formatValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFormatCurrency'] || changes['currency'] || changes['locale']) {
      this.formatValue();
    }
  }

  private formatValue(): void {
    if (this.appFormatCurrency !== null && this.appFormatCurrency !== undefined) {
      const formattedValue = new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.currency
      }).format(this.appFormatCurrency);
      
      this.el.nativeElement.textContent = formattedValue;
    }
  }
}
