
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PermissionCheckDirective } from './permission-check.directive';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PermissionTreeElement, action } from '../models/node-types.model';
import { NgxPermissionsService, NgxPermissionsModule, NgxPermissionsDirective } from 'ngx-permissions';

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

const testTree = {
  jmeleon: {
    invoice: {
      invoiceList: {
        read: 'jmeleon.invoice.invoiceList.read',
        write: 'jmeleon.invoice.invoiceList.write',
      }
    }
  }
};


describe('PermissionCheckDirective', () => {
//   @Component({
//     selector: 'app-permission-test-comp',
//     template: ` <ng-template [appPermissionCheck]="'permission'" readOnly >
//                     <div>123</div>
//                 </ng-template>`
//   })
//   class TestComponent {
//     root: PermissionTreeElement = PermissionCheckTestComponentTestTree.jmeleon.invoice;
//     // permission: PermissionTreeElement = PermissionCheckTestComponentTestTree.jmeleon.invoice.invoiceList.read;
//     // permission: PermissionTreeElement = this.root.invoiceList.read;
//   }


  @Component({
    selector: 'app-permission-test-comp2',
    template:
    //   `<div *appPermissionCheck="permission; varArr vars;else failure">
    //                   Yes
    //                 </div>
    //                 <ng-template #failure><div>No</div></ng-template>`
    // `   <div>
    // <ng-template [appPermissionCheck]="actionPath" [appPermissionCheckVarArr]="vars" [appPermissionCheckElse]="failure" >
    //                     <div>yes</div>
    //                 </ng-template>
    //                 <ng-template #failure><div>No</div></ng-template>
    // </div>`
    // `
    // <ng-template [ngxPermissionsOnly]="'root.layer1.layer2.read'" [ngxPermissionsOnlyElse]="failure">
    //                     <div>yes</div>
    //                 </ng-template>
    //               <ng-template #failure><div>No</div></ng-template>
    // `
    // `
    // <ng-template [ngIf]="ngxPermissionService.hasPermission('root.layer1.layer2.read')" [ngIfElse]="failure">
    //                     <div>yes</div>
    //                 </ng-template>
    //               <ng-template #failure><div>No</div></ng-template>
    // `
    `
    <ng-template [ngIf]="show" [ngIfElse]="failure">
                        <div>yes</div>
                    </ng-template>
                  <ng-template #failure><div>No</div></ng-template>
    `
  })
  class Test2Component implements OnInit {
    @Input() actionPath = 'root.layer1.layer2.read';
    @Input() vars: string[] = [];

    show = false;
    constructor(
      // private ngxPermS: NgxPermissionsService,
      private jPermS: JmeleonActionsPermissionService
      ) {
    }
    ngOnInit(): void {
      // this.ngxPermS.hasPermission(this.actionPath).then(hasPermission => {
      //   this.show = hasPermission;
      //   console.log('show: ', this.show);
      // });
      this.jPermS.userHasPermissionForAction(this.actionPath).subscribe(hasPermission => {
        this.show = hasPermission;
        console.log('show: ', this.show);
      });
    }
  }

  let jPermissionService: JmeleonActionsPermissionService;
  // let fixture: ComponentFixture<TestComponent>;
  let fixture2: ComponentFixture<Test2Component>;
  let ngxPermissionService: NgxPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxPermissionsModule.forRoot(), CommonModule],
      declarations: [PermissionCheckDirective,
        // TestComponent,
        Test2Component],
      // providers: [{provide: JMeleonPermissionsService, useClass: MockJmeleonActionsPermissionService}],
      providers: [JmeleonActionsPermissionService, NgxPermissionsService, NgxPermissionsDirective]
    });
    // fixture = TestBed.createComponent(TestComponent);
    fixture2 = TestBed.createComponent(Test2Component);
    jPermissionService = fixture2.debugElement.injector.get(JmeleonActionsPermissionService);
    ngxPermissionService = fixture2.debugElement.injector.get(NgxPermissionsService);
    // is this too late already? but show is true
    // ngxPermissionService.addPermission(['root.layer1.layer2.read']);
    // console.log('permissionService: ', permissionService);
  });

  // it('should create an instance', () => {

  //   const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
  //   // const directive = TestBed.get();
  //   // expect(directive).toBeTruthy();
  // });

  it('should not show component', () => {
    if (!!jPermissionService) {

      // permissionService.reset();
      // permissionService.initializeDict(PermissionCheckTestComponentTestTree);
      jPermissionService.initActionsPermittedForCurrentUser([
        // ...
        // 'root.layer1.layer2.read'
      ]);

    }
    // ngxPermissionService.addPermission('root.layer1.layer2.read');
    fixture2.detectChanges();
    const content = fixture2.debugElement.nativeElement.querySelector('div');
    // const content = fixture2.debugElement.nativeElement;

    // const content: HTMLElement = fixture2.nativeElement;
    // console.log('fixture: ', fixture2);
    console.log('content: ', content);
    console.log('content.inner: ', content.innerHTML);
    expect(content.innerHTML).toEqual('No');
  });

  // it('should  show component', () => {
  //   if (!!permissionService) {

  //     // permissionService.reset();
  //     // permissionService.initializeDict(PermissionCheckTestComponentTestTree);
  //     permissionService.initActionsPermittedForCurrentUser([
  //       'invoice.invoiceList.read'
  //     ]);
  //   }
  //   fixture.detectChanges();
  //   const content: HTMLElement = fixture.debugElement.nativeElement.querySelector('div');
  //   expect(content).not.toEqual(null);
  //   expect(content.textContent).toEqual('123');
  // });

  // it('should  show component', () => {
  //   if (!!permissionService) {

  //     // permissionService.reset();
  //     // permissionService.initializeDict(PermissionCheckTestComponentTestTree);
  //     // permissionService.initActionsPermittedForCurrentUser([
  //     //   'invoice.invoiceList.*'
  //     // ]);
  //   }
  //   fixture.detectChanges();
  //   const content: HTMLElement = fixture.debugElement.nativeElement.querySelector('div');
  //   expect(content).not.toEqual(null);
  //   expect(content.textContent).toEqual('123');
  // });

  // it('should  show component', () => {
  //   if (!!permissionService) {

  //     permissionService.reset();
  //     permissionService.initializeDict(PermissionCheckTestComponentTestTree);
  //     permissionService.initActionsPermittedForCurrentUser([
  //       'invoice.*'
  //     ]);
  //   }
  //   fixture.detectChanges();
  //   const content: HTMLElement = fixture.debugElement.nativeElement.querySelector('div');
  //   expect(content).not.toEqual(null);
  //   expect(content.textContent).toEqual('123');
  // });

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
