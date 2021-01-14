// eslint-disable-next-line import/prefer-default-export
export const isLocalEnvironment = () =>
  process.env.REACT_APP_APP_ENV === 'local';
