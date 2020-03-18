
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PermissionCheckDirective } from './permission-check.directive';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PermissionTreeElement, action } from '../models/node-types.model';

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

/**
 <div *appPermissionCheck="dto.$dtoType.read" appPermission>
 </div>
 */

describe('PermissionCheckDirective', () => {
  @Component({
    selector: 'app-permission-test-comp',
    template: ` <ng-template [appPermissionCheck]="'permission'" readOnly >
                    <div>123</div>
                </ng-template>`
  })
  class TestComponent {
    root: PermissionTreeElement = PermissionCheckTestComponentTestTree.jmeleon.invoice;
    // permission: PermissionTreeElement = PermissionCheckTestComponentTestTree.jmeleon.invoice.invoiceList.read;
    // permission: PermissionTreeElement = this.root.invoiceList.read;


  }

  let permissionService: JmeleonActionsPermissionService;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionCheckDirective, TestComponent],
      // providers: [{provide: JMeleonPermissionsService, useClass: MockJmeleonActionsPermissionService}],
      providers: [JmeleonActionsPermissionService],
      imports: [CommonModule]
    });
    fixture = TestBed.createComponent(TestComponent);
    permissionService = fixture.debugElement.injector.get(JmeleonActionsPermissionService);
    // console.log('permissionService: ', permissionService);
  });

  // it('should create an instance', () => {

  //   const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
  //   // const directive = TestBed.get();
  //   // expect(directive).toBeTruthy();
  // });

  it('should not show component', () => {
    if (!!permissionService) {

      permissionService.reset();
      permissionService.initializeDict(PermissionCheckTestComponentTestTree);
      permissionService.initActionsPermittedForCurrentUser([
        // ...
      ]);
    }
    fixture.detectChanges();
    const content = fixture.debugElement.nativeElement.querySelector('div');
    expect(content).toEqual(null);
    // expect(true).toBeTruthy();
  });

  it('should  show component', () => {
    if (!!permissionService) {

      permissionService.reset();
      permissionService.initializeDict(PermissionCheckTestComponentTestTree);
      permissionService.initActionsPermittedForCurrentUser([
        'invoice.invoiceList.read'
      ]);
    }
    fixture.detectChanges();
    const content: HTMLElement = fixture.debugElement.nativeElement.querySelector('div');
    expect(content).not.toEqual(null);
    expect(content.textContent).toEqual('123');
  });

  it('should  show component', () => {
    if (!!permissionService) {

      permissionService.reset();
      permissionService.initializeDict(PermissionCheckTestComponentTestTree);
      permissionService.initActionsPermittedForCurrentUser([
        'invoice.invoiceList.*'
      ]);
    }
    fixture.detectChanges();
    const content: HTMLElement = fixture.debugElement.nativeElement.querySelector('div');
    expect(content).not.toEqual(null);
    expect(content.textContent).toEqual('123');
  });

  it('should  show component', () => {
    if (!!permissionService) {

      permissionService.reset();
      permissionService.initializeDict(PermissionCheckTestComponentTestTree);
      permissionService.initActionsPermittedForCurrentUser([
        'invoice.*'
      ]);
    }
    fixture.detectChanges();
    const content: HTMLElement = fixture.debugElement.nativeElement.querySelector('div');
    expect(content).not.toEqual(null);
    expect(content.textContent).toEqual('123');
  });

  // root doesn't work yet. should it though? todo: decide and define
  // it('should  show component', () => { // ); {
  //   // console.log('permissionService (it): ', permissionService);
  //   if (!!permissionService) {

  //     permissionService.reset();
  //     permissionService.initializeDict(PermissionCheckTestComponentTestTree);
  //     permissionService.initActionsPermittedForCurrentUser([
  //       '*'
  //     ]);
  //   }
  //   fixture.detectChanges();
  //   const content: HTMLElement = fixture.debugElement.nativeElement.querySelector('div');
  //   expect(content).not.toEqual(null);
  //   expect(content.textContent).toEqual('123');
  // });




});

// function createTestComponent(template: string): ComponentFixture<TestHasRoleComponent> {
//   return TestBed.overrideComponent(TestHasRoleComponent, { set: { template: template } })
//       .createComponent(TestHasRoleComponent);
// }
