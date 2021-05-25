// eslint-disable-next-line import/prefer-default-export
export const isLocalAuthEnabled = () =>
  process.env.REACT_APP_LOCAL_AUTH_ENABLED === 'true';
