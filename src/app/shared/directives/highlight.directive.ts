import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
  @Input()
  highlightColor: string = 'yellow';
  
  @Input()
  defaultColor: string = 'transparent';

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.setBackgroundColor(this.defaultColor);
  }

  @HostListener('mouseenter') 
  onMouseEnter() {
    this.setBackgroundColor(this.highlightColor);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setBackgroundColor(this.defaultColor);
  }

  private setBackgroundColor(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
}

