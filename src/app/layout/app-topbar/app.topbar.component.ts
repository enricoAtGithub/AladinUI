import { Component } from '@angular/core';
import {NgModule} from '@angular/core';
import {AppLayoutComponent} from '../app-layout/app-layout.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    constructor(public app: AppLayoutComponent) {}
}
