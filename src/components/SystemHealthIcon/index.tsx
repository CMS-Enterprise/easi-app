import React from 'react';
import classnames from 'classnames';

import { IconStatus } from 'types/iconStatus';

import './index.scss';

type SystemHealthIconProps = {
  status: IconStatus;
  size: 'medium' | 'xl';
};

const SystemHealthIcon = ({ status, size }: SystemHealthIconProps) => {
  const classes = classnames(
    {
      fa: size !== 'medium',
      'fa-med': size === 'medium'
    },
    {
      'system-health-icon-success': status === 'success',
      'system-health-icon-warning': status === 'warning',
      'system-health-icon-fail': status === 'fail'
    },
    {
      'fa-check-circle': status === 'success',
      'fa-exclamation-circle': status === 'warning',
      'fa-times-circle': status === 'fail'
    },
    {
      'fa-5x': size === 'xl'
    }
  );
  return <i className={classes} />;
};

export default SystemHealthIcon;
