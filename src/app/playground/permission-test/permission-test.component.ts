import { Component, OnInit, OnDestroy } from '@angular/core';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';
import JMeleonActionsUtils from 'src/app/jmeleon/modules/permissions/utils/jmeleon-actions.utils';
import { NgxPermissionsService } from 'ngx-permissions';
import { root } from 'src/app/jmeleon/modules/permissions/permissions';
import { JmeleonActionsFacadeService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-facade.service';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import JMeleonActionTreeUtils from 'src/app/jmeleon/modules/permissions/utils/jml-action-tree.utils';
import { EntityService } from 'src/app/shared/services/entity.service';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityConfiguration } from 'src/app/shared/models/entity-configuration';
import { Field } from 'src/app/shared/models/field';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-permission-test',
  templateUrl: './permission-test.component.html',
  styleUrls: ['./permission-test.component.css']
})
export class PermissionTestComponent implements OnInit, OnDestroy {

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
  // actionPath = root.foo.bar.one;
  actionPath = root.dto.Order.read;
  vars: string[] = [];

  actionsLiveList$: Observable<string[]>;
  entityConfiguration$: Observable<EntityConfiguration[]>;

  currentDtoType: string;
  currentDtoField: string;

  userHasOrderReadPermission$: Observable<boolean>;
  userHasOrderReadPermission: boolean;

  subscriptions: Subscription[] = [];

  record$: Observable<Record<string, boolean>>;
  record: Record<string, boolean>;
  recordList$: Observable<[string, boolean][]>;
  recordList: [string, boolean][];

  missingPermissions$: Observable<string>;
  missingPermissions: string;

  constructor(
    private japs: JmeleonActionsPermissionService,
    private jmlFacade: JmeleonActionsFacadeService,
    private entityService: EntityService,
    public authService: AuthService   // needs to be publich to call it from html
    ) { }

  ngOnInit() {
    this.dict = {
      $check: 'permCheck'
    };

    this.actionsLiveList$ = this.jmlFacade.actionsTree$.pipe(
      map(tree => !!tree ? JMeleonActionTreeUtils.generateActionsList(tree) : []),
      // tap(list => console.log('test action list: ', list))
    );

    this.subscriptions.push(
      this.authService.localUser$.subscribe(user => {
        if (!user.roles.includes('Admin')){
          return;
        }
        this.initActionList();
      })
    );

    this.entityConfiguration$ = this.entityService.getEntityConfigurations()
      .pipe(
        map(configs => Object.keys(configs).map(key => configs[key])
        )
      );
    this.entityConfiguration$.subscribe(configs => {
      // console.log('configs:', configs);
    });
    this.checkPermissionWithService();
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }


  genVarDict(vars: string[]) {
    let i = 0;
    const result = {};
    while (i < vars.length) {
      const key = vars[i];
      const value = vars[i + 1];
      result[key] = value;
        i += 2;
    }
    return result;
  }

  checkPermission = (path: string, dict: object): string => this.japs.resolveVars(path, dict);

  initActionList = (): void => {
    this.entityService.filter('SecurityRight', 1, 10, undefined, '', '')
        .subscribe(data => {
          const firstRightId = data.data[0].id;

          this.jmlFacade.init();
          // find better way
          this.jmlFacade.requestActionTreeFromBackend(firstRightId);
    });
  }

  displayDtoType = (type: string): string => {
    if (type === this.currentDtoType) {
      return '';
    }
    this.currentDtoType = type;
    return this.currentDtoType;
  }

  displayDtoField = (type: string): string => {
    if (type === this.currentDtoField) {
      return '';
    }
    this.currentDtoField = type;
    return this.currentDtoField;
  }

  filterFields = (fields: Field[]) : Field[] => fields.filter(field => field.visible);

  checkPermissionWithService(){
    this.userHasOrderReadPermission$ = this.japs.userHasPermissionForAction(root.dto.Order.read);
    this.japs.userHasPermissionForAction(root.dto.Order.read).subscribe(has => this.userHasOrderReadPermission = has);

    const permissions = [root.dto.Order.read, root.dto.Order.write, 'not.existing.permission', 'not.existing.permission2', root.Scheduler.openEvSch];

    this.record$ = this.japs.userHasPermissionForActions(permissions)
      .pipe(
        tap(record => console.log('record$: ', record))
      );
    this.missingPermissions$ = this.japs.userHasPermissionForActions(permissions).pipe(
      map(record => Object
      .entries(record)
      // select only missing entries.
      .filter(entry => !entry[1])
      // select action-name
      .map(entry => entry[0])
      .join()));

    this.recordList$ = this.japs.userHasPermissionForActions(permissions)
    .pipe(
      map(record => Object.entries(record))
    );

    this.japs.userHasPermissionForActions(permissions).subscribe(record => {
      this.record = record;
      this.recordList = Object.entries(this.record);
      this.missingPermissions = Object
        .entries(record)
        .filter(entry => !entry[1])
        .map(entry => entry[0])
        .join();
    });
  }
}
