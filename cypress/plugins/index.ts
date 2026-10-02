import cypressOTP from 'cypress-otp';

const setupNodeEvents = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Cypress.PluginConfigOptions => {
  const newConfig = config;

  on('task', {
    generateOTP: cypressOTP
  });

  newConfig.env.oktaDomain =
    process.env.OKTA_DOMAIN ||
    process.env.VITE_OKTA_DOMAIN ||
    'https://test.idp.idm.cms.gov';
  newConfig.env.username = process.env.OKTA_TEST_USERNAME;
  newConfig.env.password = process.env.OKTA_TEST_PASSWORD;
  newConfig.env.otpSecret = process.env.OKTA_TEST_SECRET;
  newConfig.env.systemIntakeApi = `${process.env.VITE_API_ADDRESS}/system_intake`;

  return newConfig;
};

export default setupNodeEvents;
