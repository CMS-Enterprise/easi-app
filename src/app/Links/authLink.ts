import { setContext } from '@apollo/client/link/context';

import graphqlAddress from 'constants/graphqlURLs';
import { localAuthStorageKey } from 'constants/localAuth';

const apiHost = new URL(
  import.meta.env.VITE_API_ADDRESS || window.location.origin
).host;

/**
 * Extract auth token from local storage and return a header
 */
export function getAuthHeader(targetUrl: string) {
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

const authLink = setContext((request, { headers }) => {
  const header = getAuthHeader(graphqlAddress);
  return {
    headers: {
      ...headers,
      authorization: header
    }
  };
});

export default authLink;
