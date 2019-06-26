import { browser, by, element } from 'protractor';

export class LoginPage {

    userNameInput = element(by.id('username'));
    passwordInput = element(by.id('password'));
    loginButton = element(by.id('login'));
    // welcomeText = element(by.className('login-summary'));
    welcomeText = element(by.css('.login-summary')).getText();

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
