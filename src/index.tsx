import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import { detect } from 'detect-browser';
import { TextEncoder } from 'text-encoding';

import { localAuthStorageKey } from 'constants/localAuth';

import 'uswds';
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

let app;
const browser: any = detect();
if (browser.name === 'ie') {
  app = <UnsupportedBrowser />;
} else {
  app = (
    <Provider store={store}>
      <App />
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

    if (
      newConfig &&
      newConfig.url &&
      newConfig.url.includes(process.env.REACT_APP_API_ADDRESS as string) &&
      window.localStorage['okta-token-storage']
    ) {
      if (window.localStorage['okta-token-storage']) {
        const json = JSON.parse(window.localStorage['okta-token-storage']);
        if (json.accessToken) {
          newConfig.headers.Authorization = `Bearer ${json.accessToken.accessToken}`;
        }
      }
      // prefer dev auth if it exists
      if (window.localStorage[localAuthStorageKey]) {
        newConfig.headers.Authorization = `Bearer ${window.localStorage[localAuthStorageKey]}`;
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
