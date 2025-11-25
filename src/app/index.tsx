import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import axios from 'axios';
import { detect } from 'detect-browser';
import { TextEncoder } from 'text-encoding';

import '../config/i18n';

import * as serviceWorker from '../config/serviceWorker';
import store from '../config/store';
import UnsupportedBrowser from '../features/Miscellaneous/UnsupportedBrowser';

import authLink, { getAuthHeader } from './Links/authLink';
import errorLink from './Links/errorLink';
import uploadLink from './Links/uploadLink';
import AppComponent from './Routes';

import './index.scss';

// Initialize tracker for Google Analytics
ReactGA.initialize([
  {
    trackingId: 'G-B01YHRZXNY',
    gaOptions: {}, // optional
    gtagOptions: {} // optional
  }
]);

/**
 * Setup client for GraphQL
 */
const client = new ApolloClient({
  // TODO: Update package - apollo-upload-client (requires nodejs upgrade - https://jiraent.cms.gov/browse/EASI-3505)
  // @ts-ignore
  link: errorLink.concat(authLink).concat(uploadLink),
  cache: new InMemoryCache({
    typePolicies: {
      cedarSystemDetails: {
        merge: true
      },
      TRBRequest: {
        fields: {
          taskStatuses: {
            merge: true
          },
          trbLeadInfo: {
            merge: true
          },
          requesterInfo: {
            merge: true
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});

let App;
const browser: any = detect();
if (browser.name === 'ie') {
  App = <UnsupportedBrowser />;
} else {
  App = (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AppComponent />
      </ApolloProvider>
    </Provider>
  );
}

/**
 * expose store when run in Cypress
 */
if (window.Cypress) {
  window.store = store;
}

/**
 * axios interceptor to add authorization tokens to all requests made to
 * our application API
 */
axios.interceptors.request.use(
  config => {
    const newConfig = config;

    if (newConfig && newConfig.url) {
      const header = getAuthHeader(newConfig.url);
      if (header) {
        newConfig.headers.Authorization = header;
      }
    }

    return newConfig;
  },
  error => {
    Promise.reject(error);
  }
);

/**
 * text-encoding isn't supported in IE11. This polyfill is needed for us
 * to show the browser support error message. If this is not here, the
 * user will see a blank white screen
 */
if (typeof (window as any).TextEncoder === 'undefined') {
  (window as any).TextEncoder = TextEncoder;
}

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
