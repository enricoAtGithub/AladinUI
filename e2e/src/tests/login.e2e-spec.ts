import { LoginPage } from '../page_objects/login.po';
import { browser } from 'protractor';


describe('workspace-project App', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should perform the login with valid login data', () => {
    page.navigateTo();
    // check if on login page
    expect(page.welcomeText).toEqual('Willkommen auf Jmeleon!');
    page.doLogin('simply', 'VMtest00');

    // check if on dashboard
    // https://stackoverflow.com/questions/21748442/protractor-how-to-wait-for-page-complete-after-click-a-button
    // browser.driver.sleep(500);
    // browser.waitForAngular();
    // expect(browser.getCurrentUrl()).toEqual('/dashboard');
  });
});
