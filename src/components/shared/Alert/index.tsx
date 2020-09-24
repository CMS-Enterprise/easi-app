import React from 'react';
import classnames from 'classnames';

interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  heading?: React.ReactNode;
  children?: React.ReactNode;
  slim?: boolean;
  noIcon?: boolean;
  inline?: boolean;
}

export const Alert = ({
  type,
  heading,
  children,
  slim,
  noIcon,
  className,
  inline
}: AlertProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const classes = classnames(
    'usa-alert',
    {
      'usa-alert--success': type === 'success',
      'usa-alert--warning': type === 'warning',
      'usa-alert--error': type === 'error',
      'usa-alert--info': type === 'info',
      'usa-alert--slim': slim,
      'usa-alert--no-icon': noIcon,
      'easi-inline-alert': inline
    },
    className
  );

  return (
    <div className={classes} data-testid="alert">
      <div className="usa-alert__body">
        {heading && <h3 className="usa-alert__heading">{heading}</h3>}
        {children && <p className="usa-alert__text">{children}</p>}
      </div>
    </div>
  );
};

export default Alert;
