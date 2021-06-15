import React from 'react';
import classnames from 'classnames';

import './index.scss';

type SpinnerProps = {
  className?: string;
  size?: 'small' | 'large' | 'xl';
} & JSX.IntrinsicElements['span'];

const Spinner = ({ className, size, ...props }: SpinnerProps) => {
  const classes = classnames(
    'easi-spinner',
    {
      'easi-spinner--small': size === 'small',
      'easi-spinner--large': size === 'large',
      'easi-spinner--xl': size === 'xl'
    },
    className
  );
  return (
    <span
      className={classes}
      aria-valuetext="Loading"
      role="progressbar"
      {...props}
    />
  );
};

export default Spinner;
