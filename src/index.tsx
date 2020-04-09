import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import { TextEncoder } from 'text-encoding';
import { detect } from 'detect-browser';
import 'uswds';
import App from './views/App';
import UnsupportedBrowser from './views/UnsupportedBrowser';
import store from './store';
import './index.scss';
import * as serviceWorker from './serviceWorker';

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

axios.interceptors.request.use(
  config => {
    const newConfig = config;
    if (window.localStorage['okta-token-storage']) {
      const json = JSON.parse(window.localStorage['okta-token-storage']);
      if (json.accessToken) {
        newConfig.headers.Authorization = `Bearer ${json.accessToken.accessToken}`;
      }
    }
    return newConfig;
  },
  error => {
    Promise.reject(error);
  }
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

if (typeof (window as any).TextEncoder === 'undefined') {
  (window as any).TextEncoder = TextEncoder;
}

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
