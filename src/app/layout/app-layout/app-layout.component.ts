import {AfterViewInit, Component, Renderer2, ViewChild} from '@angular/core';
import {ScrollPanel} from 'primeng/primeng';
import { AuthService } from '../../auth/services/auth.service';
import { RootStoreState, UserProfileActions } from 'src/app/root-store/root-index';
import { Store, select } from '@ngrx/store';
import { selectError } from 'src/app/root-store/root.selectors';
import { Router } from '@angular/router';
import { AuthFacadeService } from 'src/app/auth/services/auth-facade.service';

@Component({
    selector: 'app-layout',
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements AfterViewInit {

    layoutMode = 'static';

    megaMenuMode = 'dark';

    menuMode = 'gradient';

    profileMode = 'inline';

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    resetMenu: boolean;

    menuHoverActive: boolean;

    rightPanelActive: boolean;

    rightPanelClick: boolean;

    megaMenuActive: boolean;

    megaMenuClick: boolean;

    usermenuActive: boolean;

    usermenuClick: boolean;

    activeProfileItem: any;

    @ViewChild('layoutMenuScroller', {static: false}) layoutMenuScrollerViewChild: ScrollPanel;

    constructor(
        public renderer: Renderer2,
        public authService: AuthService,
        public router: Router,
        private authFacade: AuthFacadeService
    ) {}

    ngAfterViewInit() {
        // if (this.authService.isLoggedIn) {
        //     setTimeout(() => {
        //         this.layoutMenuScrollerViewChild.moveBar();
        //     }, 100);
        // }
        this.authService.isLoggedIn$.subscribe(
            isLoggedIn => {
                if (isLoggedIn) {
                    setTimeout(() => {
                        this.layoutMenuScrollerViewChild.moveBar();
                    }, 100);
                }
            }
        );
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        if (!this.megaMenuClick) {
            this.megaMenuActive = false;
        }

        if (!this.usermenuClick && this.isSlim()) {
            this.usermenuActive = false;
            this.activeProfileItem = null;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
        this.megaMenuClick = false;
        this.usermenuClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;

        if (this.layoutMode === 'overlay') {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }


    onLogoutButtonClick(event) {
        this.topbarItemClick = true;
        this.authFacade.logout(true);

        this.router.navigate(['/login']);

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();
    }

    onRightPanelClick() {
        this.rightPanelClick = true;
    }

    onMegaMenuButtonClick(event) {
        this.megaMenuClick = true;
        this.megaMenuActive = !this.megaMenuActive;
        event.preventDefault();
    }

    onMegaMenuClick() {
        this.megaMenuClick = true;
    }

    hideOverlayMenu() {
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isHorizontal() {
        return this.layoutMode === 'horizontal';
    }

    isSlim() {
        return this.layoutMode === 'slim';
    }

    isOverlay() {
        return this.layoutMode === 'overlay';
    }

}
