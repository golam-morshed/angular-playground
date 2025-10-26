import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appFormatDate]'
})
export class FormatDateDirective implements OnInit, OnChanges {
  @Input() appFormatDate: string | null = null;
  @Input() locale: string = 'en-US';
  @Input() options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.formatValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFormatDate'] || changes['locale'] || changes['options']) {
      this.formatValue();
    }
  }

  private formatValue(): void {
    if (this.appFormatDate) {
      const formattedValue = new Date(this.appFormatDate).toLocaleDateString(this.locale, this.options);
      this.el.nativeElement.textContent = formattedValue;
    }
  }
}
