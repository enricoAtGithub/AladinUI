import { LoginPage } from '../page_objects/login.po';
import { DashboardPage} from '../page_objects/dashboard.po';
import { browser } from 'protractor';


describe('login and logout', () => {
  // let page: LoginPage;

  // beforeEach(() => {
  //   page = new LoginPage();
  // });

  it('should perform the login with valid login data', () => {
    const page = new LoginPage();
    page.navigateTo();
    page.doLogin('simply', 'VMtest00');

    // check if on dashboard
    // https://stackoverflow.com/questions/21748442/protractor-how-to-wait-for-page-complete-after-click-a-button
    browser.driver.sleep(500);
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('/dashboard');
  });

  it('should perform the logout', () => {
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('/dashboard');
    const dashboard = new DashboardPage();
    dashboard.doLogout();
    browser.driver.sleep(500);
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('/login');
  });

  it('should block login with invalid login data and show error message', () => {
    const page = new LoginPage();
    page.navigateTo();
    page.doLogin('invalid_account', 'invalid_pw_§$%');

    // check if on dashboard
    // https://stackoverflow.com/questions/21748442/protractor-how-to-wait-for-page-complete-after-click-a-button
    browser.driver.sleep(500);
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('/login');
    expect(page.getFirstErrorMsgText()).toEqual('Login failed for user invalid_account');

  });
});
