import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface InlineAlertProps {
  children: React.ReactNode;
}

export const InlineAlert = ({
  children,
  className
}: InlineAlertProps &
  React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const classes = classnames(
    'easi-inline-alert',
    'usa-alert',
    'usa-alert--info',
    className
  );

  return (
    <div className={classes} data-testid="alert">
      <div className="usa-alert__body">
        {children && <p className="usa-alert__text">{children}</p>}
      </div>
    </div>
  );
};

export default InlineAlert;
