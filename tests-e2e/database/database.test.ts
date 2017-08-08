declare var browser;
declare var firebase;
import { expect } from 'chai';

function createNewPost(title) {
  browser.click('#add');
  browser.setValue('#new-post-title', title);
  browser.setValue('#new-post-message', `Test post`);
  browser.click('button[type=submit]');
  // There is a delay here in view switching this could potentially cause
  // issues
  browser.pause(500);
}

describe('Database Tests', function() {
  this.timeout(Infinity);
  beforeEach(function() {
    browser.url('http://localhost:5003');
    expect(browser.getTitle()).to.equal('Firebase Database Quickstart');

    browser.execute(() => {
      firebase.auth().signOut();
      firebase.auth().signInAnonymously();
    });

    // Pause to allow for anonymous sign in (POTENTIAL RACE CONDITION HERE)
    browser.pause(2000);
  });
});
