import React from 'react';
import classnames from 'classnames';

type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
  error?: boolean;
};

const Label = ({ children, htmlFor, className, error }: LabelProps) => {
  const classes = classnames(
    'usa-label',
    { 'usa-label--error': error },
    className
  );

  return (
    <label className={classes} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;
