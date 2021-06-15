import React from 'react';

import Spinner from './index';

export default {
  title: 'Spinner',
  component: Spinner
};

export const Default = () => {
  return <Spinner />;
};

export const Small = () => {
  return <Spinner size="small" />;
};

export const Large = () => {
  return <Spinner size="large" />;
};

export const XL = () => {
  return <Spinner size="xl" />;
};
