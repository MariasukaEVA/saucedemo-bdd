import { IConfiguration } from '@cucumber/cucumber/api';

const config: Partial<IConfiguration> = {
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
    ['allure-cucumberjs/reporter', { resultsDir: 'allure-results' }],
  ],
  formatOptions: { snippetInterface: 'async-await' },
  parallel: 4,
  publishQuiet: true,
};

export default config;
