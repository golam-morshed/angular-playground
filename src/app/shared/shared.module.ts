import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './directives/highlight.directive';
import { FocusInvalidDirective } from './directives/focus-invalid.directive';
import { FormatCurrencyDirective } from './directives/format-currency.directive';
import { FormatDateDirective } from './directives/format-date.directive';

@NgModule({
  declarations: [
    HighlightDirective,
    FocusInvalidDirective,
    FormatCurrencyDirective,
    FormatDateDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HighlightDirective,
    FocusInvalidDirective,
    FormatCurrencyDirective,
    FormatDateDirective
  ]
})
export class SharedModule { }

