import React from 'react';
import classnames from 'classnames';

type AlertProps = {
  type: 'success' | 'warning' | 'error' | 'info';
  heading?: React.ReactNode;
  children?: React.ReactNode;
  slim?: boolean;
  noIcon?: boolean;
  inline?: boolean;
} & JSX.IntrinsicElements['div'];

type AlertTextProps = {
  className?: string;
  children: React.ReactNode;
} & JSX.IntrinsicElements['p'];

export const AlertText = ({
  className,
  children,
  ...props
}: AlertTextProps) => {
  return (
    <p className={classnames('usa-alert__text', className)} {...props}>
      {children}
    </p>
  );
};
export const Alert = ({
  type,
  heading,
  children,
  slim,
  noIcon,
  className,
  inline,
  ...props
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

  const renderChildren = () => {
    if (children) {
      if (typeof children === 'string') {
        return <AlertText>{children}</AlertText>;
      }
      return children;
    }
    return <></>;
  };

  return (
    <div className={classes} data-testid="alert" {...props}>
      <div className="usa-alert__body">
        {heading && <h3 className="usa-alert__heading">{heading}</h3>}
        {renderChildren()}
      </div>
    </div>
  );
};

export default Alert;
