// eslint-disable-next-line import/prefer-default-export
export const isDevEnvironment = () =>
  ['local'].includes(process.env.REACT_APP_APP_ENV || '');
