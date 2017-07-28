import * as webdriverio from 'webdriverio';

const options = {
  desiredCapabilities: {
    browserName: 'firefox'
  }
};

webdriverio
  .remote(options)
  .init()
  .url('http://localhost:5001')
  .getTitle()
  .then(function(title) {
    console.log('Title was: ' + title);
  })
  .catch(e => {
    console.error(e);
  })
  .end();
