import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAddress]'
})
export class AddressDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener("mouseover")
  displayAddress() {
      this.elementRef.nativeElement.querySelector('.address').style.visibility = 'visible'
  }

  @HostListener("mouseout")
  removeAddress() {
    this.elementRef.nativeElement.querySelector('.address').style.visibility = 'hidden'
  }
}
