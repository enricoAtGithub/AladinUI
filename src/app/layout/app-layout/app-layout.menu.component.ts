import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/primeng';
import { AppLayoutComponent } from '../app-layout/app-layout.component';
import { JMeleonPermissionsService } from 'src/app/auth/services/jmeleon-permissions.service';
import { environment } from 'src/environments/environment';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';
import { root } from 'src/app/jmeleon/modules/permissions/permissions';


@Component({
    selector: 'app-menu',
    template: `
        <ul app-submenu [item]="model" root="true" class="layout-menu"
            [reset]="reset" visible="true" parentActive="true"></ul>
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];

    constructor(public app: AppLayoutComponent,
        private jmeleonPermissionsService: JMeleonPermissionsService,
        private jmlActionPermissionsService: JmeleonActionsPermissionService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'FINs', icon: 'fa fa-th', routerLink: ['/fins'],
                visible: true //this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.dashboard)
            },
            {
                label: 'Modelsets', icon: 'fa fa-th', routerLink: ['/modelsets'],
                visible: true //this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.dashboard)
            },
            {
                label: 'Hersteller', icon: 'fa fa-th', routerLink: ['/manufacturer'],
                visible: true //this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.dashboard)
            },
            {
                label: 'HerstellerCodes', icon: 'fa fa-th', routerLink: ['/manufacturercodes'],
                visible: true //this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.dashboard)
            },
            {
                label: 'J48 Bäume', icon: 'fa fa-th', routerLink: ['/j48trees'],
                visible: true //this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.dashboard)
            },
            {
                label: 'Objekte', icon: 'fa fa-fw fa-eur', routerLink: ['/dto-entities'],
                visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.objekte)
            },
            {
                label: 'Administration', icon: 'fa fa-users',
                visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.administration.show),
                items: [
                    {
                        label: 'Benutzer', icon: 'fa fa-user', routerLink: ['/administration/useralt-management'],
                        visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.administration.benutzer)
                    },
                    {
                        label: 'Rollenverwaltung', icon: 'fa fa-users', routerLink: ['/administration/role-management'],
                        visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.administration.rollenverwaltung)
                    },
                    {
                        label: 'Rechteverwaltung', icon: 'fa fa-users', routerLink: ['/administration/permission-management'],
                        visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.administration.rechteverwaltung)
                    }
                ]
            },
            {
                label: 'Konfiguration', icon: 'fa fa-cogs',
                visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.configuration.show),
                items: [
                    {
                        label: 'Katalogverwaltung', icon: 'pi pi-folder-open', routerLink: ['/configuration/catalogue-management'],
                        visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.configuration.katalogverwaltung)
                    },
                    {
                        label: 'DTO Konfiguration', icon: 'fa fa-code', routerLink: ['/configuration/dto-configuration'],
                        visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.configuration.dtoKonfiguration)
                    },
                    {
                        label: 'Aktionen', icon: 'fa fa-terminal', routerLink: ['/configuration/actions'],
                        visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.configuration.actions)
                    },
                    {
                        label: 'Einstellungen', icon: 'fa fa-cog', routerLink: ['/configuration/settings'],
                        visible: this.jmeleonPermissionsService.currentUserHasPermission(root.Menuitems.configuration.einstellungen)
                    }
                ]
            },
        ];
        // this.jmlActionPermissionsService.userHasPermissionForAction(root.)
    }

    changeTheme(theme: string, scheme: string) {
        const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';

        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        themeLink.href = 'assets/theme/theme-' + theme + '.css';

        this.app.menuMode = scheme;
    }
}

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)"
                   class="ripplelink" *ngIf="!child.routerLink"
                   [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                   [id]="!!child.id ? child.id : 'menuItem'+i">
                    <i [ngClass]="child.icon"></i><span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="fa fa-fw fa-angle-down layout-menuitem-toggler" *ngIf="child.items"></i>
                </a>

                <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink" *ngIf="child.routerLink"
                   [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                   [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                   [id]="!!child.id ? child.id : 'menuItem'+i">
                    <i [ngClass]="child.icon"></i><span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="fa fa-fw fa-angle-down layout-menuitem-toggler" *ngIf="child.items"></i>
                </a>
                <div class="submenu-arrow" *ngIf="child.items"></div>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset" [parentActive]="isActive(i)"
                    [@children]="(app.isSlim()||app.isHorizontal())&&root ? isActive(i) ?
                    'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px',
                opacity: 0
            })),
            state('visibleAnimated', style({
                height: '*',
                opacity: 1
            })),
            state('visible', style({
                height: '*',
                'z-index': 100,
                opacity: 1
            })),
            state('hidden', style({
                height: '0px',
                'z-index': '*',
                opacity: 0
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    _reset: boolean;

    _parentActive: boolean;

    activeIndex: number;

    constructor(public app: AppLayoutComponent) { }

    itemClick(event: Event, item: MenuItem, index: number) {
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }

        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            setTimeout(() => {
                this.app.layoutMenuScrollerViewChild.moveBar();
            }, 450);
            event.preventDefault();
        }

        // hide menu
        if (!item.items) {
            if (this.app.isHorizontal() || this.app.isSlim()) {
                this.app.resetMenu = true;
            } else {
                this.app.resetMenu = false;
            }

            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    }

    onMouseEnter(index: number) {
        if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())
            && !this.app.isMobile() && !this.app.isTablet()) {
            this.activeIndex = index;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = null;
        }
    }

    @Input() get parentActive(): boolean {
        return this._parentActive;
    }

    set parentActive(val: boolean) {
        this._parentActive = val;

        if (!this._parentActive) {
            this.activeIndex = null;
        }
    }
}
