import React from 'react';
import { Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';

import { IconStatus } from 'types/iconStatus';

import './index.scss';

type SystemHealthIconProps = {
  className?: string;
  status: IconStatus;
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
    {
      'system-health-icon-success': status === 'success',
      'system-health-icon-warning': status === 'warning',
      'system-health-icon-fail': status === 'fail'
    },
    {
      'margin-right-05': label !== undefined && size === 'medium'
    },
    className
  );

  const sizeChecker = (iconSize: string) => {
    if (iconSize === 'lg') {
      return 5;
    }
    if (iconSize === 'xl') {
      return 7;
    }
    return undefined;
  };

  const iconSwitcher = (iconStatus: string) => {
    if (iconStatus === 'success') {
      return (
        <Icon.CheckCircleOutline
          className={classes}
          size={sizeChecker(size)}
          data-testid="system-health-icon"
          aria-label="check"
        />
      );
    }
    if (iconStatus === 'fail') {
      return (
        <Icon.HighlightOff
          className={classes}
          size={sizeChecker(size)}
          data-testid="system-health-icon"
          aria-label="highlight-off"
        />
      );
    }
    if (iconStatus === 'warning') {
      return (
        <Icon.ErrorOutline
          className={classes}
          size={sizeChecker(size)}
          data-testid="system-health-icon"
          aria-label="error"
        />
      );
    }
    return null;
  };

  return (
    <>
      {iconSwitcher(status)}
      {label}
    </>
  );
};

export default SystemHealthIcon;
