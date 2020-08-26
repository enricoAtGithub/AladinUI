import { Directive, Input, AfterContentInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {
  @Input() public autoFocus: boolean;

  constructor(private el: ElementRef) { }

  public ngAfterContentInit(): void {
    setTimeout(() => {
      console.log(this.el.nativeElement);
      const ne = this.el.nativeElement;
      switch (ne.localName) {
        case 'p-dropdown':
        case 'p-checkbox':
          ne.children[0].children[0].children[0].focus();
          break;
        case 'p-calendar':
          ne.children[0].children[0].focus();
          break;
        default:
          ne.focus();
      }
    }, 20);
  }

}
