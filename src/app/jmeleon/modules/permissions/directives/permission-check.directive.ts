import { Directive, OnInit, Input, TemplateRef, ViewContainerRef,
  ChangeDetectorRef } from '@angular/core';
import { NgxPermissionsDirective, NgxPermissionsService, NgxPermissionsConfigurationService,
  NgxRolesService } from 'ngx-permissions';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { root } from '../permissions';


@Directive({
  selector: '[appPermissionCheck]',
  exportAs: 'appPermissionCheck',
})
export class PermissionCheckDirective extends NgxPermissionsDirective implements OnInit {
  _jmlVarDict: Object;


  @Input('appPermissionCheck') set actionPath(value: string|string[]) {
    
    // when the path for an action is invalid, then the value is empty and
    // sadly the permission lib recognizes empty values as valid
    this.ngxPermissionsOnly = !!value ? value : '§§§_INVALID_VALUE_§§§';

  }

  @Input('appPermissionCheckElse') set permCheckElse(value: TemplateRef<any>) {
    this.ngxPermissionsElse = value;
  }

  @Input() set appPermissionCheckVarDict(dict: Object) {
      // console.log('dict was set to: ', dict);
      this._jmlVarDict = dict;
      const currentPermission = this.ngxPermissionsOnly as string;
      // console.log('current permission: ', currentPermission);
      this.ngxPermissionsOnly = JMeleonActionsUtils.resolveVars(
        // multiple permissions are not supported by the jmeleon permission concept
        currentPermission, dict);
      // console.log('new value: ', this.ngxPermissionsOnly);

  }

  @Input() set appPermissionCheckVarArr(values: string[]) {

    this.appPermissionCheckVarDict = this.jmlPermissionService.genVarDict(values);
  }


  /**
   *
   */
  constructor(
    permissionsService: NgxPermissionsService,
    configurationService: NgxPermissionsConfigurationService,
    rolesService: NgxRolesService,
    viewContainer: ViewContainerRef,
    changeDetector: ChangeDetectorRef,
    templateRef: TemplateRef<any>,
    private jmlPermissionService: JmeleonActionsPermissionService
    ) {
    super(permissionsService, configurationService, rolesService, viewContainer, changeDetector, templateRef);
  }

  ngOnInit() {
    super.ngOnInit();
    this.jmlPermissionService.initWithCurrentUserActionsIfNotYetInitialized();
  }
}
