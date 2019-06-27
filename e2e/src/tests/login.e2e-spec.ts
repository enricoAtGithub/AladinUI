import { LoginPage } from '../page_objects/login.po';
import { DashboardPage} from '../page_objects/dashboard.po';
import { browser } from 'protractor';


describe('login and logout', () => {
  // let page: LoginPage;

  // beforeEach(() => {
  //   page = new LoginPage();
  // });

  it('should perform the login with valid login data', () => {
    let page = new LoginPage();
    page.navigateTo();
    // check if on login page
    // browser.waitForAngular();
    // expect(page.welcomeText).toEqual('Willkommen auf Jmeleon!');
    page.doLogin('simply', 'VMtest00');

    // check if on dashboard
    // https://stackoverflow.com/questions/21748442/protractor-how-to-wait-for-page-complete-after-click-a-button
    browser.driver.sleep(500);
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('/dashboard');
  });

  it('should perform the logout', () => {
    browser.waitForAngular();
    // expect('to').toEqual('to');
    expect(browser.getCurrentUrl()).toContain('/dashboard');
    let dashboard = new DashboardPage();    
    dashboard.doLogout();
    browser.driver.sleep(500);
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('/login');
  });

});
