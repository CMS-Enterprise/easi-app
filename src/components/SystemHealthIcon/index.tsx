import React from 'react';
import classnames from 'classnames';

import { IconStatus } from 'types/iconStatus';

import './index.scss';

type SystemHealthIconProps = {
  status: IconStatus;
  size: 'medium' | 'xl';
  label?: string;
};

const SystemHealthIcon = ({ status, size, label }: SystemHealthIconProps) => {
  const classes = classnames(
    'fa',
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
    },
    {
      'margin-right-05': label !== undefined && size === 'medium'
    }
  );

  return (
    <>
      <i className={classes} />
      {label}
    </>
  );
};

export default SystemHealthIcon;
