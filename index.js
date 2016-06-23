#!/usr/bin/env node
var minimist = require('minimist'),
  webdriver = require('selenium-webdriver'),
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
    var process = childProcess.spawn(phantomPath, [
      '--webdriver=4444', '--ignore-ssl-errors=true'
    ]);
    setTimeout(function () {
      resolve({
        address: 'http://127.0.0.1:4444',
        process: process
      });
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

  startServer().then(function (server) {

    var driver = new webdriver.Builder()
      .usingServer(server.address)
      .withCapabilities({"browserName": "phantomjs"})
      .build();

    var z = Zenefits(driver, username, password);

    var killChild = function () {
      server.process.kill('SIGQUIT');
    }

    switch (action) {
      case "in":
        z.clockIn().then(killChild);
        break;
      case "out":
        z.clockOut().then(killChild);
        break;
      case "lunch":
        z.startMeal().then(killChild);
        break;
      case "endlunch":
        z.endMeal().then(killChild);
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
