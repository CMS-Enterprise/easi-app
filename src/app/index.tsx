import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import axios from 'axios';
import { detect } from 'detect-browser';
import { createClient } from 'graphql-ws';
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

// Pull the graphql address from the vite environment variables
// However, if we don't have a VITE_GRAPHQL_ADDRESS, we should simply assume that the API is hosted on the same domain & port as the frontend
// We also assume a path of /api/graph/query should be tacked onto that
const graphqlAddress =
  import.meta.env.VITE_GRAPHQL_ADDRESS ||
  `${window.location.origin}/api/graph/query`;

// Set up WebSocket link for subscriptions
// Extract protocol and address from graphqlAddress
const [protocol, gqlAddressWithoutProtocol] = graphqlAddress.split('://');
const wsProtocol = protocol === 'https' ? 'wss' : 'ws'; // Use WSS when connecting over HTTPS

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${wsProtocol}://${gqlAddressWithoutProtocol}`,
    connectionParams: () => {
      const authToken = getAuthHeader(graphqlAddress);
      // Return authToken if available, empty object otherwise
      // The backend's InitFunc will handle authentication and reject if token is missing
      return authToken ? { authToken } : {};
    },
    shouldRetry: () => true
  })
);

// HTTP link with error handling and auth/upload middleware
// TODO: Update package - apollo-upload-client (requires nodejs upgrade - https://jiraent.cms.gov/browse/EASI-3505)
// @ts-ignore
const httpLink = errorLink.concat(authLink).concat(uploadLink);

// The split function routes subscriptions to WebSocket and other operations to HTTP
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
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
