/** @type {import('@cucumber/cucumber').IConfiguration} */
module.exports = {
  default: {
    paths: ['src/features/**/*.feature'],
    require: [
      'src/fixtures/world.ts',
      'src/fixtures/hooks.ts',
      'src/steps/**/*.steps.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber/index.html',
      'json:reports/cucumber/report.json',
      'allure-cucumberjs/reporter:reports/allure-results-stream.txt',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    parallel: 4,
    publishQuiet: true,
  },
};
