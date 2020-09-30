import { AfterContentInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appStopClickPropagation]'
})
export class StopClickPropagationDirective implements AfterContentInit {

  constructor(private el: ElementRef) { }

  ngAfterContentInit() {
    this.el.nativeElement.onclick = ev => ev.stopPropagation();
  }
}
