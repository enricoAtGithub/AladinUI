import { Directive, OnInit, Input, TemplateRef, ViewContainerRef,
  ChangeDetectorRef } from '@angular/core';
import { NgxPermissionsDirective, NgxPermissionsService, NgxPermissionsConfigurationService,
  NgxRolesService } from 'ngx-permissions';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { root } from '../permissions';
// import { NgxPermissionsDirective, NgxPermissionsService,
//   NgxPermissionsConfigurationService, NgxRolesService } from 'ngx-permissions/lib';


@Directive({
  selector: '[appPermissionCheck]',
  exportAs: 'appPermissionCheck',
  // inputs: ['ngxPermissionsOnlyThen']
})
export class PermissionCheckDirective extends NgxPermissionsDirective implements OnInit {
  _jmlVarDict: Object;


  // @Input('appPermissionCheck') actionPath: string;
  @Input('appPermissionCheck') set actionPath(value: string|string[]) {
    console.log('value was set.', value);
    // console.log('dict (for appPermissionCheck): ', this._jmlVarDict);
    this.ngxPermissionsOnly = value;

  }

  @Input('appPermissionCheckElse') set permCheckElse(value: TemplateRef<any>) {
    this.ngxPermissionsElse = value;
  }

  // @Input() set jmlVarDict(dict: Object) {
  //   console.log('dict was set to: ', dict);
  //   this._jmlVarDict = dict;
  // }
  // @Input() appPermissionCheckVarDict: Object;
  @Input() set appPermissionCheckVarDict(dict: Object) {
      console.log('dict was set to: ', dict);
      this._jmlVarDict = dict;
      // const currentPermission = typeof(this.ngxPermissionsOnly) === 'string' ? this.ngxPermissionsOnly : this.ngxPermissionsOnly[0];
      const currentPermission = this.ngxPermissionsOnly as string;
      console.log('current permission: ', currentPermission);
      this.ngxPermissionsOnly = JMeleonActionsUtils.resolveVars(
        // multiple permissions are not supported by the jmeleon permission concept
        currentPermission, dict);
      console.log('new value: ', this.ngxPermissionsOnly);

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
    // console.log('ng on init start');
    // console.log('dict: ', this._jmlVarDict);
    super.ngOnInit();
    // this.ngxPermissionsOnly = this.actionPath;
    // console.log('ng on init stop');
    // console.log('dict: ', this._jmlVarDict);
  }
}
