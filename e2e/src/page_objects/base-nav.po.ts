import { browser, by, element } from 'protractor';

/** base class for all pages with nav-bar */

export class BaseNavPage {
    userProfileToggleButton = element(by.id('sidebar-profile-button'));
    logoutLink = element(by.id('logout-link'));
    logoutListItem = element(by.id('logout-li'));

    doLogout() {
        // do visibility check for logout button

        this.userProfileToggleButton.click();
        
        browser.driver.sleep(500);
        browser.waitForAngular();

        // this.logoutLink.click();
        this.logoutListItem.click();
    }
}
