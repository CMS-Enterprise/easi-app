import React, { ReactNode, ReactNodeArray } from 'react';
import classnames from 'classnames';

type FieldGroupProps = {
  children: ReactNode | ReactNodeArray;
  className?: string;
  error?: boolean;
};
const FieldGroup = ({ children, className, error }: FieldGroupProps) => {
  const fieldGroupClasses = classnames(
    'usa-form-group',
    { 'usa-form-group--error': error },
    className
  );
  return <div className={fieldGroupClasses}>{children}</div>;
};

export default FieldGroup;
