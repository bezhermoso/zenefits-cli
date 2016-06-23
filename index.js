#!/usr/bin/env node
var minimist = require('minimist'),
  webdriver = require('selenium-webdriver'),
  chrome = require('selenium-webdriver/chrome'),
  driverPath = require('chromedriver').path,
  phantomjs = require('phantomjs-prebuilt'),
  childProcess = require('child_process'),
  Zenefits = require('./lib/zenefits'),
  Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  path = require('path');

var credentialsFile = path.join(process.env.HOME, '.zenefits.json');

var phantomPath = phantomjs.path;

var argv = minimist(process.argv.slice(2));

var action = argv._.length > 0 ? argv._[0] : null;

var credentials = function () {
  return fs.readFileAsync(credentialsFile, 'utf8')
    .catch(function () {
      return {
        username: process.env.ZENEFITS_USERNAME,
        password: process.env.ZENEFITS_PASSWORD,
      };
    })
    .then(JSON.parse)
    .catch(function () {
      return {};
    });
}

var startServer = function () {
  return new Promise(function (resolve, reject) {
    childProcess.spawn(phantomPath, [
      '--webdriver=4444', '--ignore-ssl-errors=true'
    ]);
    setTimeout(function () {
      resolve('http://127.0.0.1:4444');
    }, 2000);
  });
};

credentials().then(function (creds) {
  var username = creds.username,
    password = creds.password;

  if (!username || !password) {
    console.error('Can\'t find your Zenefits credentials.');
    console.error('Either set the env variables ZENEFITS_USERNAME and ZENEFITS_PASSWORD in your shell, or save your credentials in ' + process.env.HOME + '/.zenefits.json as follows:');
    console.error('');
    console.error(JSON.stringify({
      username: '<your username>',
      password: '<your password>'
    }, null, 2));
    process.exit(1);
  }

  //var service = new chrome.ServiceBuilder(driverPath).build();
  //chrome.setDefaultService(service);
  //

  startServer().then(function (address) {

    console.log(address);
    var driver = new webdriver.Builder()
      .usingServer(address)
      .withCapabilities({"browserName": "phantomjs"})
      .build();

    var z = Zenefits(driver, username, password);

    switch (action) {
      case "in":
        z.clockIn();
        break;
      case "out":
        z.clockOut();
        break;
      case "lunch":
        z.startMeal();
        break;
      case "endlunch":
        z.endMeal();
        break;
      default:
        console.error('Invalid input. Supported: `in`, `out`, `lunch`, and `endlunch`.');
        process.exit(1);
    }
  });

}, function (e) {
  console.error(e);
  process.exit(1);
});
