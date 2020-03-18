import { Component } from '@angular/core';
import { AppLayoutComponent } from './app-layout.component';

@Component({
    template: `
        <div class="ui-g" id="colorDialogSchemaSelection">
            <div class="ui-g-12 ui-md-4">
                <p-radioButton [(ngModel)]="selectedScheme" value="light" label="Hell"></p-radioButton>
            </div>
            <div class="ui-g-12 ui-md-4">
                <p-radioButton [(ngModel)]="selectedScheme"value="dark" label="Dunkel"></p-radioButton>
            </div>
            <div class="ui-g-12 ui-md-4">
                <p-radioButton [(ngModel)]="selectedScheme" value="gradient" label="Verlauf"></p-radioButton>
            </div>
        </div>
        <div class="ui-g">
            <div class="ui-g-12 ui-md-6">
                <p-dropdown [options]="themes" [(ngModel)]="selectedTheme"></p-dropdown>
            </div>
            <div class="ui-g-12 ui-md-6">
                <p-button type="submit" style="float: right" icon="pi pi-user-plus" iconPos="left" label="Speichern" (click)="changeTheme();"></p-button>
            </div>
        </div>
    `
})
export class AppThemeComponent {
    themes =  [
        {value: 'alive', label: 'Lebendig'},
        {value: 'ash', label: 'Asche'},
        {value: 'blue', label: 'Blau'},
        {value: 'bluegrey', label: 'Blaugrau'},
        {value: 'cappuccino', label: 'Cappuccino'},
        {value: 'cyan', label: 'Zyan'},
        {value: 'emerald', label: 'Smaragd'},
        {value: 'green', label: 'Grün'},
        {value: 'grey', label: 'Grau'},
        {value: 'hollywood', label: 'Hollywood'},
        {value: 'montreal', label: 'Montreal'},
        {value: 'noir', label: 'Schwarz'},
        {value: 'orange', label: 'Orange'},
        {value: 'peak', label: 'Berge'},
        {value: 'predawn', label: 'Sonnenaufgang'},
        {value: 'purple', label: 'Lila'},
        {value: 'teal', label: 'Türkis'},
        {value: 'yellow', label: 'Gelb'},
    ];
    selectedTheme = 'blue';
    selectedScheme = 'light';

    constructor(public app: AppLayoutComponent) {}

    changeTheme() {
        const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');
        layoutLink.href = 'assets/layout/css/layout-' + this.selectedTheme + '.css';

        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        themeLink.href = 'assets/theme/theme-' + this.selectedTheme + '.css';

        this.app.menuMode = this.selectedScheme;
    }

}
