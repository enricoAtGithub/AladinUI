import { Directive, ElementRef, Renderer2, OnDestroy, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';

@Directive({
  selector: '[appPermissionCheck]'
})
export class PermissionCheckDirective implements OnInit, OnDestroy {
  // is there any useful default value? probably not.
  // can we here use function even when a leaf is provided? maybe a union type? (also for service)
  // @Input('appPermissionCheck') actionPath: Function;
  private _actionPath: Function|Object;
  @Input('appPermissionCheck') set actionPath(path: Function|Object) {
    this._actionPath = path;
    this.check(path);
  }

  constructor(
    private tRef: TemplateRef<any>,
    private vcRef: ViewContainerRef,
    private permissionService: JmeleonActionsPermissionService) { }

  ngOnInit(): void {
    this.check(this._actionPath);
  }
  ngOnDestroy(): void {
    // subscription? or else remove this.
  }

  check(path: Function|Object): void {
    if (this.permissionService.userHasPermissionForAction(path)) {
      this.vcRef.createEmbeddedView(this.tRef);
    } else {
      this.vcRef.clear();
    }
  }
}
