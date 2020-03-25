
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PermissionCheckDirective } from './permission-check.directive';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PermissionTreeElement, action } from '../models/node-types.model';
import { NgxPermissionsService, NgxPermissionsModule, NgxPermissionsDirective } from 'ngx-permissions';


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

@Component({
    selector: 'app-permission-directive-test-comp01',
    template:
    `
    <ng-template [ngxPermissionsOnly]="'jmeleon.invoice.invoiceList.read'" [ngxPermissionsOnlyThen]="then" [ngxPermissionsOnlyElse]="wtf" >
        <div>test</div>
    </ng-template>
    <ng-template #then>
    <div>then</div>
    </ng-template>
    <ng-template #wtf>
        <div>wtf</div>
    </ng-template>
    `
})
class Test3Component implements OnInit {
    constructor(private permissionsService: NgxPermissionsService){}
    ngOnInit(): void {
        this.permissionsService.loadPermissions(['test']);
    }
    
}

describe('PermissionCheckDirective - base case', () => {
    let component: Test3Component;
    let fixture: ComponentFixture<Test3Component>;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports: [
                NgxPermissionsModule.forRoot(), CommonModule
            ],
            declarations: [
                Test3Component,
                PermissionCheckDirective
            ]
        });
        fixture = TestBed.createComponent(Test3Component);
        component = fixture.componentInstance;
    });

    it('should create component', () => {
        expect(component).toBeDefined();
    });

    it('should not show else div', () => {
        const debugEl: HTMLElement = fixture.debugElement.nativeElement;
        
        console.log('debugEl: ', debugEl);
        console.log('child', fixture.debugElement.childNodes[0].nativeNode)
        const div: HTMLElement = debugEl.querySelector('div');
        fixture.detectChanges();
        expect(div).toBeDefined();
        expect(div).not.toBeNull();
        expect(div.innerText).toEqual('else');
    });
    

});

