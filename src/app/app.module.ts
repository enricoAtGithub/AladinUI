import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routes';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { GrowlModule } from 'primeng/growl';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AuthModule } from './auth/auth.module';
import { AceModule, ACE_CONFIG, AceConfigInterface } from 'ngx-ace-wrapper';


import { AppComponent } from './app.component';
import { AppRightPanelComponent } from './layout/app-rightpanel/app.rightpanel.component';
import { AppProfileComponent } from './layout/app-layout/app-layout.profile.component';
import { AppMenuComponent, AppSubMenuComponent } from './layout/app-layout/app-layout.menu.component';
import { AppBreadcrumbComponent } from './layout/app-breadcrumb/app.breadcrumb.component';
import { AppTopBarComponent } from './layout/app-topbar/app.topbar.component';
import { AppFooterComponent } from './layout/app-footer/app.footer.component';

import { BreadcrumbService } from './breadcrumb.service';
import { UserModule } from './user/user.module';
import { ReportsComponent } from './reports/reports.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { AppThemeComponent } from './layout/app-layout/app-layout.theme.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { RootStoreModule } from './root-store/root-store.module';
import { TokenInterceptor } from 'src/token.interceptor';
import { AppConfig } from './shared/app-config';
import { HttpHeadersService } from './shared/services/http-headers.service';
import { SharedModule } from './shared/shared.module';
import { HttpErrorRepsonseInterceptor } from 'src/http-error-repsonse.interceptor';
import { FormsModule } from '@angular/forms';
// import { FileUploadDialogComponent } from './shared/components/file-upload-dialog/file-upload-dialog.component';
import { FileSaverModule } from 'ngx-filesaver';
import { ProgressSpinnerModule } from 'primeng/primeng';
import { JmeleonModule } from './jmeleon/jmeleon.module';
import { DiagramsModule } from './jmeleon/modules/diagrams/diagrams.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { SettingsModule } from './jmeleon/modules/settings/settings.module';
import { SchedulerModule } from './jmeleon/modules/scheduler/scheduler.module';
import { PermissionsModule } from './jmeleon/modules/permissions/permissions.module';
import { RouterModule } from '@angular/router';

import { FinComponent } from './domain/components/fin/fin.component';
import { ModelSetComponent } from './domain/components/model_set/modelset.component';
import { ManufacturerComponent } from './domain/components/manufacturer/manufacturer.component';
import { ManufacturerCodeComponent } from './domain/components/manufacturercode/manufacturer_code.component';
import { J48TreeComponent } from './domain/components/j48tree/j48tree.component';

export function initializeApp(appConfig: AppConfig) {
    console.log('initialize app');
    appConfig.loadServerInfo();
    return () => appConfig.load();
    // return appConfig.load();
}

const DEFAULT_ACE_CONFIG: AceConfigInterface = {
    tabSize: 2,
    fontSize: '16px'
};

@NgModule({
    imports: [
        AuthModule,
        BrowserModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        DynamicDialogModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        GrowlModule,
        InplaceModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScrollPanelModule,
        SelectButtonModule,
        SharedModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        UserModule,
        VirtualScrollerModule,
        RootStoreModule,
        ProgressSpinnerModule,
        JmeleonModule,
        DiagramsModule,
        NgxPermissionsModule.forRoot(),
        DigitOnlyModule,
        AceModule,
        SettingsModule,
        SchedulerModule,
        PermissionsModule,
        RouterModule
    ],
    declarations: [
        AppComponent,
        AppLayoutComponent,
        AppRightPanelComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppThemeComponent,
        AppFooterComponent,
        AppProfileComponent,
        ProfileComponent,
        ReportsComponent,
        FinComponent,
        ModelSetComponent,
        ManufacturerComponent,
        ManufacturerCodeComponent,
        J48TreeComponent
    ],
    providers: [
        AppConfig,
        { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfig], multi: true },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorRepsonseInterceptor, multi: true },
        BreadcrumbService,
        HttpHeadersService,
        { provide: ACE_CONFIG, useValue: DEFAULT_ACE_CONFIG }
    ],

    entryComponents: [AppThemeComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
