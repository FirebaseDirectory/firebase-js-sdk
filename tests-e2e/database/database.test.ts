declare var browser;
declare var firebase;
import { expect } from 'chai';

describe('Storage Tests', function() {
  this.timeout(Infinity);
  beforeEach(function() {
    browser.url('http://localhost:5003');
    expect(browser.getTitle()).to.equal('Firebase Database Quickstart');

    browser.execute(
      function(username, password) {
        firebase.auth().signInWithEmailAndPassword(username, password);
      },
      process.env.FIREBASE_USERNAME,
      process.env.FIREBASE_PASSWORD
    );

    // Pause to allow for anonymous sign in (POTENTIAL RACE CONDITION HERE)
    browser.pause(2000);
  });
  it('Should properly upload a file with anonymous auth', function() {
    const date = new Date().getTime();

    browser.debug();

    browser.click('#add');
    browser.setValue('#new-post-title', `Post at (${date})`);
    browser.setValue('#new-post-message', `Test post`);

    browser.click('button[type=submit]');
  });
});
