var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  ExpectedConditions = webdriver.ExpectedConditions,
  until = webdriver.until;

module.exports = function (driver, username, password) {
  var login = function () {
    driver.findElement(By.name('username')).sendKeys(username);
    driver.findElement(By.name('password')).sendKeys(password);
    driver.findElement(By.css('#loginForm button[type=submit]')).click();
    driver.wait(function () {
      return driver.getCurrentUrl().then(function (url) {
        return url == 'https://secure.zenefits.com/dashboard/#/';
      })
    });
    driver.quit();
  };

  var clockIn = function () {
    driver.get('https://secure.zenefits.com/dashboard/#/timereport/report-time-dashboard/CLOCK_IN');
    login();
  };

  var clockOut = function () {
    driver.get('https://secure.zenefits.com/dashboard/#/timereport/report-time-dashboard/CLOCK_OUT');
    login();
  };

  var startMeal = function () { 
    driver.get('https://secure.zenefits.com/dashboard/#/timereport/report-time-dashboard/START_LUNCH');
    login();
  };
  
  var endMeal = function () { 
    driver.get('https://secure.zenefits.com/dashboard/#/timereport/report-time-dashboard/END_LUNCH');
    login();
  };

  return {
    clockIn: clockIn,
    clockOut: clockOut,
    startMeal: startMeal,
    endMeal: endMeal
  };
};

