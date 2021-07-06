import React from 'react';
import classnames from 'classnames';

type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
} & JSX.IntrinsicElements['label'];

const Label = ({ children, htmlFor, className, ...props }: LabelProps) => {
  const classes = classnames('usa-label', className);

  return (
    <label className={classes} htmlFor={htmlFor} {...props}>
      {children}
    </label>
  );
};

export default Label;
