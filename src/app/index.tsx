import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  Operation
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import axios from 'axios';
import { detect } from 'detect-browser';
import i18next from 'i18next';
import { TextEncoder } from 'text-encoding';
import {
  getCurrentErrorMeta,
  setCurrentErrorMeta
} from 'wrappers/ErrorContext/errorMetaStore';

import Alert from 'components/Alert';
import { localAuthStorageKey } from 'constants/localAuth';
import { knownErrors } from 'i18n/en-US/error';

import '../config/i18n';

import * as serviceWorker from '../config/serviceWorker';
import store from '../config/store';
import UnsupportedBrowser from '../features/Miscellaneous/UnsupportedBrowser';

import AppComponent from './Routes';

import './index.scss';

const apiHost = new URL(
  import.meta.env.VITE_API_ADDRESS || window.location.origin
).host;

// Initialize tracker for Google Analytics
ReactGA.initialize([
  {
    trackingId: 'G-B01YHRZXNY',
    gaOptions: {}, // optional
    gtagOptions: {} // optional
  }
]);

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

// Pull the graphql address from the vite environment variables
// However, if we don't have a VITE_GRAPHQL_ADDRESS, we should simply assume that the API is hosted on the same domain & port as the frontend
// We also assume a path of /api/graph/query should be tacked onto that
const graphqlAddress =
  import.meta.env.VITE_GRAPHQL_ADDRESS ||
  `${window.location.origin}/api/graph/query`;

const uploadLink = createUploadLink({
  uri: graphqlAddress
});

const authLink = setContext((request, { headers }) => {
  const header = getAuthHeader(graphqlAddress);
  return {
    headers: {
      ...headers,
      authorization: header
    }
  };
});

/**
 * Helper function to determine operation type
 */
function getOperationType(
  operation: Operation
): 'query' | 'mutation' | 'subscription' | 'unknown' {
  try {
    const definition = operation.query.definitions[0];
    if (definition?.kind === 'OperationDefinition') {
      return definition.operation || 'unknown';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

const findKnownError = (errorMessage: string): string | undefined => {
  return Object.keys(knownErrors).find(key => errorMessage.includes(key));
};

const operationErrorMap: Record<string, string> = {
  CreateSystemIntakeGRBReviewers:
    'There was an issue adding GRB reviewers. Please try again, and if the error persists, try again at a later date.'
};

/**
 * Error Link
 *
 * A link that intercepts GraphQL errors and displays them in a toast notification.
 * It also allows for overriding the error message for a specific component.
 */
const errorLink = onError(({ graphQLErrors, operation, networkError }) => {
  /** Handle GraphQL errors */
  if (graphQLErrors) {
    const { overrideMessage, skipError } = getCurrentErrorMeta();
    const isReactNode = React.isValidElement(overrideMessage);
    const operationType = getOperationType(operation);

    graphQLErrors.forEach(err => {
      let knownErrorMessage = '';

      let knownError: string | undefined;

      // Handle different operation types if needed
      switch (operationType) {
        case 'mutation':
          if (operationErrorMap[operation.operationName]) {
            knownErrorMessage = operationErrorMap[operation.operationName];
          } else {
            knownError = findKnownError(err.message);
            knownErrorMessage = knownError
              ? knownErrors[knownError]
              : knownErrorMessage;
          }
          break;
        default:
          knownErrorMessage = '';
      }

      if (operationType === 'mutation' && !skipError) {
        toast.error(
          <div>
            {isReactNode ? (
              overrideMessage
            ) : (
              <Alert
                type="error"
                slim={false}
                heading={i18next.t<string>('error:global.generalError')}
                isClosable={false}
              >
                <p className="margin-0">
                  {knownErrorMessage || overrideMessage}
                </p>
                <p className="margin-0">
                  {i18next.t<string>('error:global.generalBody')}
                </p>
              </Alert>
            )}
          </div>
        );

        // Clear the override message after displaying the error
        setCurrentErrorMeta({});
      }
    });
  }

  // Handle network errors (SERVER DOWN, etc.)
  if (networkError && !graphQLErrors) {
    const operationType = getOperationType(operation);

    // Only show toast for mutations
    if (operationType === 'mutation') {
      toast.error(
        <Alert
          type="error"
          slim={false}
          heading={i18next.t<string>('error:global.networkError.heading')}
          isClosable={false}
        >
          <p className="margin-0">
            {i18next.t<string>('error:global.networkError.body')}
          </p>
        </Alert>
      );
    }
  }
});

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
