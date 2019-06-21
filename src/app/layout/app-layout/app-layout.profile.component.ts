import {Component, OnInit} from '@angular/core';
import {AppLayoutComponent} from '../app-layout/app-layout.component';
import {trigger, state, transition, style, animate} from '@angular/animations';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';
import { AppThemeComponent } from './app-layout.theme.component';
import { DialogService } from 'primeng/primeng';

@Component({
    selector: 'app-inline-profile',
    template: `
        <div class="user-profile">
            <a href="#" (click)="onProfileClick($event)" id="sidebar-profile-button">
                <img [src]="gravatarLink" style="width: 92px; height:92px; border-radius:46px"/>
                <span class="sidebar-profile-name">{{fullName}}</span>
                <span class="sidebar-profile-role">Administrator</span>
            </a>

            <ul id="sidebar-usermenu" class="usermenu" [ngClass]="{'usermenu-active':app.usermenuActive}"
                [@menu]="app.isSlim()? app.usermenuActive ? 'visible' : 'hidden' :
                app.usermenuActive ? 'visibleAnimated' : 'hiddenAnimated'">
                <li #profile [ngClass]="{'menuitem-active':app.activeProfileItem === profile}">
                    <a href="#" (click)="onProfileItemClick($event,profile); router.navigate(['/profile'])">
                        <i class="fa fa-fw fa-user"></i>
                        <span class="topbar-item-name">Profil</span>
                    </a>
                </li>
                <li #settings [ngClass]="{'menuitem-active':app.activeProfileItem === settings}">
                    <a href="#" (click)="onProfileItemClick($event,settings)">
                        <i class="fa fa-fw fa-cog"></i>
                        <span class="topbar-item-name">Einstellungen</span>
                        <i class="layout-menuitem-toggler fa fa-fw fa-angle-down"></i>
                    </a>
                    <ul>
                        <li role="menuitem">
                            <a href="#" (click)="onProfileSubItemClick($event); showThemeDialog();">
                                <i class="fa fa-fw fa-paint-brush"></i>
                                <span>Farbschema ändern</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li #logout [ngClass]="{'menuitem-active':app.activeProfileItem === logout}">
                <a href="/" (click)="onProfileItemClick($event,logout); authService.logout(); router.navigate(['/login'])">
                    <i class="fa fa-fw fa-sign-out"></i>
                    <span class="topbar-item-name">Logout</span>
                </a>
            </li>
            </ul>
        </div>
    `,
    animations: [
        trigger('menu', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*'
            })),
            state('hidden', style({
                height: '0px'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    providers: [DialogService]
})
export class AppProfileComponent implements OnInit {
    fullName = '';
    gravatarLink = '';

    constructor(public app: AppLayoutComponent, public authService: AuthService,
        public router: Router, private dialogService: DialogService) {}

    ngOnInit() {
        this.authService.localUser$.subscribe(
            user => {
                // console.log('user: ', user);
                if (user) {
                    this.fullName = `${user.user.firstName} ${user.user.lastName}`;
                    let email = ' ';
                    if (user.user.email) {
                        email = user.user.email;
                    }
                    this.gravatarLink = 'https://gravatar.com/avatar/' + <string>Md5.hashStr(email.trim().toLowerCase());
                }
            }
        );
    }

    onProfileClick(event) {
        this.app.usermenuClick = true;
        this.app.usermenuActive = !this.app.usermenuActive;
        event.preventDefault();
    }

    onProfileItemClick(event, item) {
        this.app.usermenuClick = true;
        if (this.app.activeProfileItem === item) {
            this.app.activeProfileItem = null; } else {
            this.app.activeProfileItem = item; }

        event.preventDefault();
    }

    onProfileSubItemClick(event) {
        event.preventDefault();
    }

    showThemeDialog() {
        const ref = this.dialogService.open(AppThemeComponent, {
            header: 'Farbschema bearbeiten',
            width: '25%'
        });
    }

}
