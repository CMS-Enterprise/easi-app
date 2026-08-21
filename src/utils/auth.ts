// TODO (EASI-5058): remove after Okta redirect login is permanent
export const isOktaRedirectLoginEnabled = () =>
  import.meta.env.VITE_OKTA_REDIRECT_LOGIN_ENABLED === 'true';

// eslint-disable-next-line import/prefer-default-export
export const isLocalAuthEnabled = () =>
  import.meta.env.VITE_LOCAL_AUTH_ENABLED === 'true';
