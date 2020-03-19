import { Directive, ElementRef, Renderer2, OnDestroy, OnInit, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { PermissionTreeElement } from '../models/node-types.model';

@Directive({
  selector: '[appPermissionCheck]'
})
export class PermissionCheckDirective implements OnInit {

  @Input('appPermissionCheck') actionPath: string;

  @Input() jmlVarDict: Object;

  constructor(
    private tRef: TemplateRef<any>,
    private vcRef: ViewContainerRef,
    private permissionService: JmeleonActionsPermissionService) { }

  ngOnInit(): void {
    this.check(this.actionPath);
  }

  check(path: string, jmlVarDict: Object = null): void {
    this.vcRef.clear();
    if (this.permissionService.userHasPermissionForAction(path, jmlVarDict)) {
      console.log('user HAS permissions for: ', path);
      this.vcRef.createEmbeddedView(this.tRef);
    }
  }
}
