import React from 'react';
import classnames from 'classnames';

type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
  ariaLabel?: string;
};

const Label = ({ children, htmlFor, className, ariaLabel }: LabelProps) => {
  const classes = classnames('usa-label', className);

  return (
    <label className={classes} htmlFor={htmlFor} aria-label={ariaLabel}>
      {children}
    </label>
  );
};

export default Label;
