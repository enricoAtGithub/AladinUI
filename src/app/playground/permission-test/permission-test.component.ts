import { Component, OnInit } from '@angular/core';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';
import JMeleonActionsUtils from 'src/app/jmeleon/modules/permissions/utils/jmeleon-actions.utils';
import { NgxPermissionsService } from 'ngx-permissions';
import { root } from 'src/app/jmeleon/modules/permissions/permissions';
import { JmeleonActionsFacadeService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-facade.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import JMeleonActionTreeUtils from 'src/app/jmeleon/modules/permissions/utils/jml-action-tree.utils';
import { EntityService } from 'src/app/shared/services/entity.service';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-permission-test',
  templateUrl: './permission-test.component.html',
  styleUrls: ['./permission-test.component.css']
})
export class PermissionTestComponent implements OnInit {

  dict: {};
  valuesForObj = ['obj1', 'obj2', 'obj3',
    'obj4', 'obj5'
  ];
  valuesForProp = ['prop1', 'prop2'];


  valuesForDtoType: [string, string[]][] = [
    ['Order', ['name', 'invoiceAddress']],
    ['User', ['loginName', 'firstName', 'lastName']],
  ];
  root = root;
  actionPath = root.foo.bar.one;
  vars: string[] = [];

  actionsLiveList$ : Observable<string[]>;

  constructor(
    private japs: JmeleonActionsPermissionService,
    // private ngrxPermissionService: NgxPermissionsService
    private jmlFacade: JmeleonActionsFacadeService,
    private entityService: EntityService,
    ) { }

  ngOnInit() {
    this.dict = {
      $check: 'permCheck'
    };

    this.japs.initActionsPermittedForCurrentUser([
      'default.permCheck.seeFirstParagraph',
      'a',
      'default.foo.read',
      'default.obj1.prop2.read',
      'default.obj2.prop1.read',
      // 'root.dto.User.firstName.read'
      'dto.Order.name.read',
      'dto.Order.invoiceAddress.read',
      // 'dto.User.loginName.read',
      'dto.User.firstName.read',
      'dto.User.lastName.read',
      'foo.bar.one'

    ]);
    // JMeleonActionsUtils.resolveVars();
    // console.log('ngxP has permission for \'a\'', );
    // this.ngrxPermissionService.hasPermission('a').then(has => console.log('ngxP has permission for \'a\' (promise)', has));
    // this.japs.userHasPermissionForAction('a').subscribe(has => console.log('ngxP has permission for \'a\' (subscribe)', has));
    this.actionsLiveList$ = this.jmlFacade.actionsTree$.pipe(
      map(tree => !!tree ? JMeleonActionTreeUtils.generateActionsList(tree) : []),
      // tap(list => console.log('test action list: ', list))
    );

    this.initActionList();



  }
  genVarDict(vars: string[]) {
    // console.log('vars: ', vars);
    let i = 0;
    const result = {};
    while (i < vars.length) {
      const key = vars[i];
      const value = vars[i + 1];
        // result[vars[i]] = vars[i + i];
      // console.log('key: ', key);
      // console.log('value: ', value);
      result[key] = value;
        i += 2;
    }
    // console.log('result: ', result);
    return result;
  }

  checkPermission = (path: string, dict: object): string => this.japs.resolveVars(path, dict);

  initActionList = () => {
    this.entityService.filter('SecurityRight', 1, 10, '', '')
        .subscribe(data => { 
          // console.log('entity data: ', data);
          const firstRightId = data.data[0].id;
          
          this.jmlFacade.init();
          //find better way
          this.jmlFacade.updateActionTreeViaBackend(firstRightId);
    });
  }

}
