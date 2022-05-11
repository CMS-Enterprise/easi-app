// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const cypressOTP = require('cypress-otp');
const cypressCodeCovTask = require('@cypress/code-coverage/task');
const wp = require('@cypress/webpack-preprocessor');
const apollo = require('@apollo/client');
const luxon = require('luxon');
const fetch = require('cross-fetch'); // needed to allow apollo-client to make queries from Node environment

const issueLCIDQuery = require('../../src/queries/IssueLifecycleIdQuery')
  .default;

const cache = new apollo.InMemoryCache();

function createApolloClient(euaId) {
  return new apollo.ApolloClient({
    cache,
    link: new apollo.HttpLink({
      uri: 'http://localhost:8080/api/graph/query', // TODO make this generalizable?
      fetch,
      headers: {
        // need job code to be able to issue LCID
        Authorization: `Local {"euaId":"${euaId}", "favorLocalAuth":true, "jobCodes":["EASI_D_GOVTEAM"]}`
      }
    })
  });
}
function issueLCID({
  euaId,
  intakeId,
  shouldSendEmail,
  recipientEmails,
  scope
}) {
  const apolloClient = createApolloClient(euaId);
  return new Promise(resolve => {
    const input = {
      intakeId,
      expiresAt: luxon.DateTime.utc(4567, 12, 1).toISO(),
      feedback: 'feedback',
      scope,
      shouldSendEmail,
      notificationRecipients: {
        regularRecipientEmails: recipientEmails,
        shouldNotifyITGovernance: false,
        shouldNotifyITInvestment: false
      }
    };
    apolloClient
      .mutate({
        mutation: issueLCIDQuery,
        variables: {
          input
        }
      })
      .then(result => {
        resolve(result);
      });
  });
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    generateOTP: cypressOTP,
    issueLCID
  });
  cypressCodeCovTask(on, config);

  const options = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: { transpileOnly: true }
          }
        ]
      }
    }
  };
  on('file:preprocessor', wp(options));

  const newConfig = config;
  newConfig.env.oktaDomain = process.env.OKTA_DOMAIN;
  newConfig.env.username = process.env.OKTA_TEST_USERNAME;
  newConfig.env.password = process.env.OKTA_TEST_PASSWORD;
  newConfig.env.otpSecret = process.env.OKTA_TEST_SECRET;
  newConfig.env.systemIntakeApi = `${process.env.REACT_APP_API_ADDRESS}/system_intake`;

  return config;
};
