import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './directives/highlight.directive';
import { FocusInvalidDirective } from './directives/focus-invalid.directive';
import { FormatCurrencyPipe } from './pipes/format-currency.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';

@NgModule({
  declarations: [
    HighlightDirective,
    FocusInvalidDirective,
    FormatCurrencyPipe,
    FormatDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HighlightDirective,
    FocusInvalidDirective,
    FormatCurrencyPipe,
    FormatDatePipe
  ]
})
export class SharedModule { }

