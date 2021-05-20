import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import axios from 'axios';
import { detect } from 'detect-browser';
import { TextEncoder } from 'text-encoding';

import { localAuthStorageKey } from 'constants/localAuth';

import './i18n';

import App from './views/App';
import UnsupportedBrowser from './views/UnsupportedBrowser';
import * as serviceWorker from './serviceWorker';
import store from './store';

import './index.scss';

/**
 * Enables react axe accessibility tooling in development environments
 */
if (process.env.NODE_ENV === 'development') {
  import('react-axe').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}

const apiHost = new URL(process.env.REACT_APP_API_ADDRESS || '').host;

/**
 * Extract auth token from local storage and return a header
 */
function getAuthHeader(targetUrl: string) {
  const targetHost = new URL(targetUrl).host;
  if (targetHost !== apiHost) {
    return null;
  }

  // prefer dev auth if it exists
  if (
    window.localStorage[localAuthStorageKey] &&
    JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth
  ) {
    return `Local ${window.localStorage[localAuthStorageKey]}`;
  }

  if (window.localStorage['okta-token-storage']) {
    const json = JSON.parse(window.localStorage['okta-token-storage']);
    if (json.accessToken) {
      return `Bearer ${json.accessToken.accessToken}`;
    }
  }

  return null;
}

/**
 * Setup client for GraphQL
 */
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ADDRESS
});

const authLink = setContext((request, { headers }) => {
  const header = getAuthHeader(process.env.REACT_APP_GRAPHQL_ADDRESS as string);
  return {
    headers: {
      ...headers,
      authorization: header
    }
  };
});

const typePolicies = {};

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});

let app;
const browser: any = detect();
if (browser.name === 'ie') {
  app = <UnsupportedBrowser />;
} else {
  app = (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
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

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
