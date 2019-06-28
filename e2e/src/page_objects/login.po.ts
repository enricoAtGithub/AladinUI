import { browser, by, element } from 'protractor';

export class LoginPage {

    userNameInput = element(by.id('username'));
    passwordInput = element(by.id('password'));
    loginButton = element(by.id('loginBt'));
    // welcomeText = element(by.className('login-summary'));
    welcomeText = element(by.css('.login-summary')).getText();
    // firstErrorMsg = element(by.xpath('/html/body/app-root/app-login/html/body/div[2]/div/div[2]/p-messages/div/ul/li/span')).getText();
    // what if there are multiple messages?
    // firstErrorMsg = element(by.css('.ui-messages-detail')).getText();

    getFirstErrorMsgText() {
      return element(by.css('.ui-messages-detail')).getText();
    }

    navigateTo() {
        // check if logged out?
        return browser.get('/');
      }

    doLogin(userName: string, password: string) {
      this.userNameInput.sendKeys(userName);
      this.passwordInput.sendKeys(password);
      this.loginButton.click();
    }
}
