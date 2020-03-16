import { Directive, ElementRef, Renderer2, OnDestroy, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';

@Directive({
  selector: '[appPermissionCheck]',
  // providers: [JmeleonActionsPermissionService]
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
      console.log('user HAS permissions for: ', path);
      this.vcRef.clear();
      this.vcRef.createEmbeddedView(this.tRef);
    } else {
      console.log('user has no permissions for: ', this.permissionService.getActionStringFromFunction(path));
      console.log('action-list:', this.permissionService.actionsList);
      console.log('permitted-action-list:', this.permissionService.permittedActionsList);
      this.vcRef.clear();
    }
  }
}
