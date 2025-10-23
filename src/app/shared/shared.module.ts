import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './directives/highlight.directive';
import { FocusInvalidDirective } from './directives/focus-invalid.directive';

@NgModule({
  declarations: [
    HighlightDirective,
    FocusInvalidDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HighlightDirective,
    FocusInvalidDirective
  ]
})
export class SharedModule { }

