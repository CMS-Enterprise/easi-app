import React from 'react';
import classnames from 'classnames';

type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
  required?: boolean;
} & JSX.IntrinsicElements['label'];

const Label = ({
  children,
  htmlFor,
  className,
  required,
  ...props
}: LabelProps) => {
  const classes = classnames('usa-label', className);

  return (
    <label className={classes} htmlFor={htmlFor} {...props}>
      {children}
      {required && <span className="text-red"> *</span>}
    </label>
  );
};

export default Label;
