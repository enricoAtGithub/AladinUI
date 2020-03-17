import { TestBed } from '@angular/core/testing';

import { JmeleonActionsPermissionService } from './jmeleon-actions-permission.service';
import { BranchFlags, action } from '../models/node-types.model';

class TestActionTree2 {
  static customTest = class {
    static dto = class {
      static $dtoType = class {
          static $dtoField = class {
              // ensure, that none-flag does not influence the evaluation of the tree
              static flags: BranchFlags = BranchFlags.None;
              static create = action();
              static read = action();
              static write = action();
              static delete = action();
              static test2 = '';
          };
      };
      static test = class {
          static flags: BranchFlags = BranchFlags.IgnoreNodeInActionList;
          static subTest = class {
            static read = action();

         };
      };
      static same1 = class {
          static test = class {
              static read = action();
          };
      };

      static same2 = class {
          static test = class {
          };
      };
  };
  };
}

describe('JmeleonPermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    console.log('JmeleonPermissionService-beforeEach==========================================================================================================================================================================');
  });

  it('should be created', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    expect(service).toBeTruthy();
  });

  it('should be initilized', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    service.initializeDict();
    expect(service.actionsList.length).toBeGreaterThan(0);
  });

  it('should be able to be initialized with custom data', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    service.initializeDict(TestActionTree2);
    expect(service.actionsList.length).toBeGreaterThan(0);
  });

  it('should to be initialized as expected with custom data', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    service.initializeDict(TestActionTree2);
    console.log('action list: ', service.actionsList);
    expect(service.actionsList.includes('dto.*')).toBeTruthy();
    expect(service.actionsList.includes('dto.$dtoType.*')).toBeTruthy();
    expect(service.actionsList.includes('dto.$dtoType.$dtoField.*')).toBeTruthy();
    expect(service.actionsList.includes('dto.$dtoType.$dtoField.create')).toBeTruthy();
    expect(service.actionsList.includes('dto.$dtoType.$dtoField.read')).toBeTruthy();
    expect(service.actionsList.includes('dto.$dtoType.$dtoField.write')).toBeTruthy();
    expect(service.actionsList.includes('dto.$dtoType.$dtoField.delete')).toBeTruthy();
    expect(service.actionsList.includes('dto.test.subTest.*')).toBeTruthy();
    expect(service.actionsList.includes('dto.test.subTest.read')).toBeTruthy();
    expect(service.actionsList.includes('dto.same1.*')).toBeTruthy();
    expect(service.actionsList.includes('dto.same1.test.*')).toBeTruthy();
    expect(service.actionsList.includes('dto.same1.test.read')).toBeTruthy();
    expect(service.actionsList.includes('dto.same2.*')).toBeTruthy();
    expect(service.actionsList.includes('dto.same2.test.*')).toBeTruthy();
  });


  it('should initialize the users current permissions', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    service.initializeDict(TestActionTree2);
    const permittedActions = [
      'dto.$dtoType.$dtoField.read',
      'dto.test.subTest'
    ];
    service.initActionsPermittedForCurrentUser(permittedActions);
    expect(service.permittedActionsList.length).toBeGreaterThan(0);
  });

  it('should identify a action from action tree and provide the correct string representation', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    service.initializeDict(TestActionTree2);

    // recognize node
    expect(service.getActionStringFromFunction(TestActionTree2.customTest.dto.$dtoType)).toEqual('dto.$dtoType.*');
    // recognize leaf
    expect(service.getActionStringFromFunction(TestActionTree2.customTest.dto.$dtoType.$dtoField.read)).toEqual('dto.$dtoType.$dtoField.read');
    // expect(service.getActionStringFromFunction(console.log)).toThrow(TypeError);
  });



  it('should detect users permissions correctly - relative path', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    service.initializeDict(TestActionTree2);
    const userPermissions = ['dto.same1.test.read', 'dto.$dtoType.$dtoField.*'];
    service.initActionsPermittedForCurrentUser(userPermissions);

    expect(service.userHasPermissionForAction(TestActionTree2.customTest.dto.$dtoType.$dtoField.read)).toBeTruthy();
  });

  it('should detect users permissions correctly - full path', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    service.initializeDict(TestActionTree2);
    const userPermissions = ['dto.same1.test.read', 'dto.$dtoType.$dtoField.*'];
    service.initActionsPermittedForCurrentUser(userPermissions);

    expect(service.userHasPermissionForAction(TestActionTree2.customTest.dto.same1.test.read)).toBeTruthy();
  });

  it('should detect users missing permissions correctly - full path', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    service.initializeDict(TestActionTree2);
    const userPermissions = ['dto.$dtoType.$dtoField.*'];
    service.initActionsPermittedForCurrentUser(userPermissions);

    expect(service.userHasPermissionForAction(TestActionTree2.customTest.dto.same1.test.read)).not.toBeTruthy();
  });






















});
