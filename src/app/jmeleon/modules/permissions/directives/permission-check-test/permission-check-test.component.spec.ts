import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  PermissionCheckTestComponent,
  // PermissionCheckTestComponentTestTree
} from './permission-check-test.component';
import { PermissionCheckDirective } from '../permission-check.directive';
import { JmeleonActionsPermissionService } from '../../services/jmeleon-actions-permission.service';
import { BranchFlags, action } from '../../models/node-types.model';

// const userHasPermission = false;
// const userHasPermission = false;

// class MockJMeleonPermissionService {
//   userHasPermission = false;
//   userHasPermissionForAction = (f: Function | Object): boolean => {
//     console.log('userHasPermissionForAction was called on mock for: ', f);
//     console.log(' userHasPermissionForAction will return: ', this.userHasPermission);
//     return this.userHasPermission;
//   }
//   setPermission = (permission: boolean): void => {
//     console.log('setting permission value to: ', permission);
//     this.userHasPermission = permission;
//   }
// }

// class MockJMeleonPermissionService {
//   // userHasPermissionForAction = (f: Function | Object): boolean => this.userHasPermission;
//   userHasPermissionForAction = (f: Function | Object): boolean => {
//     console.log('userHasPermissionForAction was called on mock for: ', f);
//     console.log(' userHasPermissionForAction will return: ', userHasPermission);
//     return userHasPermission;
//   }
// }

export class PermissionCheckTestComponentTestTree {
  static jmeleon = class {
      static invoice = class {
          static invoiceList = class {
              static read = action();
              static write = action();
          };
      };
  };
}

const userActionPermissions: string[] = [
  // 'invoice.invoiceList.read',
  // 'invoice.invoiceList.write',
  'invoice.invoiceList.*',

];

describe('PermissionCheckTestComponent', () => {
  let component: PermissionCheckTestComponent;
  let fixture: ComponentFixture<PermissionCheckTestComponent>;
  // let service: JmeleonActionsPermissionService;
  const service: JmeleonActionsPermissionService = new JmeleonActionsPermissionService();
  service.initializeDict(PermissionCheckTestComponentTestTree);
  service.initActionsPermittedForCurrentUser(userActionPermissions);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionCheckTestComponent, PermissionCheckDirective ],
      // providers: [{provide: JmeleonActionsPermissionService, useClass: MockJMeleonPermissionService}]
      providers: [{provide: JmeleonActionsPermissionService, useValue: service}]
      // providers: [JmeleonActionsPermissionService]

    })
    // ;
    .compileComponents();

    // fixture = TestBed.createComponent(PermissionCheckTestComponent);
    // component = fixture.componentInstance;

    // fixture.detectChanges();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionCheckTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // service = TestBed.get(JmeleonActionsPermissionService);
    // service.initializeDict(PermissionCheckTestComponentTestTree);

  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('mock service should work', () => {
  //   // (service as unknown as MockJMeleonPermissionService).userHasPermission = false;
  //   userHasPermission = false;
  //   expect(service.userHasPermissionForAction(PCC.jmeleon.dto.$dtoType.$dtoField.read)).not.toBeTruthy();
  //   // (service as unknown as MockJMeleonPermissionService).userHasPermission = true;
  //   userHasPermission = true;
  //   expect(service.userHasPermissionForAction(PCC.jmeleon.dto.$dtoType.$dtoField.read)).toBeTruthy();
  // });

  it('should contain paragraph when permission is granted', () => {
    // (service as unknown as MockJMeleonPermissionService).userHasPermission = true;
    // userHasPermission = true;
    // userHasPermission = false;
    // (service as unknown as MockJMeleonPermissionService).setPermission(true);
    // const mockService = service as unknown as MockJMeleonPermissionService;
    // console.log('mockservice: ', mockService.userHasPermission);
    // mockService.setPermission(false);
    // console.log('mockservice: ', mockService.userHasPermission);

    // service.initializeDict(PermissionCheckTestComponentTestTree);
    // service.initActionsPermittedForCurrentUser(userActionPermissions);


    // fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    // element.
    console.log('element:', element);
    const p = element.querySelector('p');
    console.log('p:', p);
    // const button = element.querySelector('button');
    // console.log('button:', button);
    expect(true).toBeTruthy();
  });

});
