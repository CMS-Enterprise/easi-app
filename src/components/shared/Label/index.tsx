import React from 'react';
import classnames from 'classnames';

type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
};

const Label = ({ children, htmlFor, className }: LabelProps) => {
  const classes = classnames('usa-label', className);

  return (
    <label className={classes} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;
