// eslint-disable-next-line import/prefer-default-export
export const isLocalAuthEnabled = () =>
  import.meta.env.VITE_LOCAL_AUTH_ENABLED === 'true';
