import { browser, by, element } from 'protractor';

export class LoginPage {

    userNameInput = element(by.id('usernameInput'));
    passwordInput = element(by.id('passwordInput'));
    loginButton = element(by.id('loginBt'));
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
