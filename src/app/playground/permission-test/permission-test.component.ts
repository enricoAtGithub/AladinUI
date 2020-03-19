import { Component, OnInit } from '@angular/core';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';
import JMeleonActionsUtils from 'src/app/jmeleon/modules/permissions/utils/jmeleon-actions.utils';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-permission-test',
  templateUrl: './permission-test.component.html',
  styleUrls: ['./permission-test.component.css']
})
export class PermissionTestComponent implements OnInit {

  constructor(private japs: JmeleonActionsPermissionService,
    private ngrxPermissionService: NgxPermissionsService) { }

  ngOnInit() {
    this.japs.initActionsPermittedForCurrentUser([
      'default.permCheck.seeFirstParagraph',
      'a'
    ]);
    // JMeleonActionsUtils.resolveVars();
    // console.log('ngxP has permission for \'a\'', );
    // this.ngrxPermissionService.hasPermission('a').then(has => console.log('ngxP has permission for \'a\' (promise)', has));
    // this.japs.userHasPermissionForAction('a').subscribe(has => console.log('ngxP has permission for \'a\' (subscribe)', has));
  }
  genVarDict(vars: string[]) {
    let i = 0;
    const result = {};
    while (i < vars.length) {
        result[vars[i]] = vars[i + i];
        i += 2;
    }
    return result;
  }

  checkPermission = (path: string, dict: object): string => this.japs.resolveVars(path, dict);

}
