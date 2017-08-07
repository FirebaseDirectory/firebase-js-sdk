declare var browser;
declare var firebase;
import { expect } from 'chai';

describe('Storage Tests', function() {
  this.timeout(Infinity);
  beforeEach(function() {
    browser.url('http://localhost:5003');
    expect(browser.getTitle()).to.equal('Firebase Database Quickstart');

    browser.execute(() => {
      firebase.auth().signInAnonymously();
    });

    // Pause to allow for anonymous sign in (POTENTIAL RACE CONDITION HERE)
    browser.pause(2000);
  });
  it('Should properly post a new topic', function() {
    const title = `Post at (${new Date().getTime()})`;
    browser.click('#add');
    browser.setValue('#new-post-title', title);
    browser.setValue('#new-post-message', `Test post`);

    browser.click('button[type=submit]');

    // There is a delay here in view switching this could potentially cause
    // issues
    browser.pause(500);

    const text = browser.getText(
      '#user-posts-list .post .mdl-card__title-text'
    );
    expect(text).to.equal(title);
  });
});
