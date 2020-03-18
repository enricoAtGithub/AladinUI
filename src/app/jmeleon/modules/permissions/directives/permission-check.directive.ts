import { Directive, ElementRef, Renderer2, OnDestroy, OnInit, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { PermissionTreeElement } from '../models/node-types.model';

@Directive({
  selector: '[appPermissionCheck]'
})
export class PermissionCheckDirective implements OnInit, OnDestroy, OnChanges {

  private _actionPath: Function|Object;

  @Input('appPermissionCheck') actionPath: PermissionTreeElement;
  // input apppermissionreadnly

  constructor(
    private tRef: TemplateRef<any>,
    private vcRef: ViewContainerRef,
    private permissionService: JmeleonActionsPermissionService) { }

  ngOnInit(): void {
    this.check(this._actionPath);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // should we even support changes in the path???
    const actionPath = changes.actionPath;
    if (actionPath) {
      this._actionPath = actionPath.currentValue;
      if (actionPath.firstChange) {
        return;
      }
      this.check(actionPath.currentValue);
    }
  }
  ngOnDestroy(): void {
    // subscription? or else remove this.
  }

  check(path: Function|Object): void {
    this.vcRef.clear();
    if (this.permissionService.userHasPermissionForAction(path)) {
      console.log('user HAS permissions for: ', path);
      this.vcRef.createEmbeddedView(this.tRef);
    }
  }
}
