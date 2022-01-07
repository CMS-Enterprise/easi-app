import React from 'react';
import classnames from 'classnames';

import { IconStatus } from 'types/iconStatus';

import './index.scss';

type SystemHealthIconProps = {
  className?: string;
  status?: IconStatus;
  size: 'medium' | 'lg' | 'xl';
  label?: string;
};

const SystemHealthIcon = ({
  status,
  size,
  label,
  className
}: SystemHealthIconProps) => {
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
      'fa-2x': size === 'lg'
    },
    {
      'fa-5x': size === 'xl'
    },
    {
      'margin-right-05': label !== undefined && size === 'medium'
    },
    className
  );

  return (
    <>
      <i className={classes} data-testid="system-health-icon" />
      {label}
    </>
  );
};

export default SystemHealthIcon;
