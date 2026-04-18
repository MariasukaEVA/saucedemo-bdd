const report = require('multiple-cucumber-html-reporter');

report.generate({
  jsonDir: 'reports/cucumber',
  reportPath: 'reports/html',
  metadata: {
    browser: { name: 'chrome', version: 'latest' },
    device: 'Local test machine',
    platform: { name: process.platform },
  },
  customData: {
    title: 'SauceDemo BDD Test Run',
    data: [
      { label: 'Project', value: 'saucedemo-bdd' },
      { label: 'Environment', value: process.env.ENV || 'uat' },
    ],
  },
});
