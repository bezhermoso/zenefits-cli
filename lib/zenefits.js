var webdriver = require('selenium-webdriver'),
  By = webdriver.By;

module.exports = function (driver, username, password) {
  var login = function () {
    driver.get('https://secure.zenefits.com/dashboard');
    driver.findElement(By.name('username')).sendKeys(username);
    driver.findElement(By.name('password')).sendKeys(password);
    driver.findElement(By.css('#loginForm button[type=submit]')).click();
  };

  var goto = function (url) {
    driver.get(url);
    // PhantomJS does not appear to reload the page when only the URL fragment
    // has changed. So we explicitly reload it here.
    driver.navigate().refresh();
    return driver.wait(function () {
      return driver.getCurrentUrl().then(function (url) {
        return url == 'https://secure.zenefits.com/dashboard/#/';
      })
    }, 5000);
  }

  var clockIn = function () {
    login();
    return goto('https://secure.zenefits.com/dashboard/#/timereport/report-time-dashboard/CLOCK_IN').then(function () {
      driver.quit();
    })
  };

  var clockOut = function () {
    login();
    return goto('https://secure.zenefits.com/dashboard/#/timereport/report-time-dashboard/CLOCK_OUT').then(function () {
      driver.quit();
    });
  };

  var startMeal = function () { 
    login();
    return goto('https://secure.zenefits.com/dashboard/#/timereport/report-time-dashboard/START_LUNCH').then(function () {
      driver.quit();
    });
  };
  
  var endMeal = function () { 
    login();
    return goto('https://secure.zenefits.com/dashboard/#/timereport/report-time-dashboard/END_LUNCH').then(function () {
      driver.quit();
    });
  };

  return {
    clockIn: clockIn,
    clockOut: clockOut,
    startMeal: startMeal,
    endMeal: endMeal
  };
};

