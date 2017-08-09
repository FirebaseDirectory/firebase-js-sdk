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
  browser.pause(1500);
}

function clearSession() {
  browser.execute(() => {
    firebase.auth().signOut();
  });
  browser.reload();
  browser.url('http://localhost:5002');

  browser.execute(() => {
    firebase.auth().signInAnonymously();
  });

  // Pause to allow for anonymous sign in (POTENTIAL RACE CONDITION HERE)
  browser.pause(5000);
}

describe('Database Tests', function() {
  beforeEach(function() {
    browser.url('http://localhost:5002');
    expect(browser.getTitle()).to.equal('Firebase Database Quickstart');

    browser.execute(() => {
      firebase.auth().signOut();
      firebase.auth().signInAnonymously();
    });

    // Pause to allow for anonymous sign in (POTENTIAL RACE CONDITION HERE)
    browser.pause(2000);
  });
  it('Should properly post a new topic (db push)', function() {
    const title = `Post at (${new Date().getTime()})`;

    createNewPost(title);

    const text = browser.getText(
      '#user-posts-list .post .mdl-card__title-text'
    );
    expect(text).to.equal(title);
  });
  it('Should properly like a post (db transaction)', function() {
    createNewPost('Likable Post');

    browser.click('#user-posts-list .post .star .not-starred');
    const count = browser.getText('#user-posts-list .post .star .star-count');

    expect(parseInt(count, 10)).to.equal(1);
  });
  it('Should properly read a post/like from another user', function() {
    const title = `Likable Post (${new Date().getTime()})`;

    createNewPost(title);
    browser.click('#user-posts-list .post .star .not-starred');

    clearSession();

    let firstPost: String | String[] = browser.getText(
      '#recent-posts-list .post .mdl-card__title-text'
    );
    firstPost = Array.isArray(firstPost) ? firstPost[0] : firstPost;

    expect(firstPost).to.equal(title);

    browser.click('#recent-posts-list .post .star .not-starred');

    let count = browser.getText('#recent-posts-list .post .star .star-count');
    count = Array.isArray(count) ? count[0] : count;

    expect(parseInt(count, 10)).to.equal(2);
  });
});
