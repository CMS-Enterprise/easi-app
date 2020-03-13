import React, { ReactNode, ReactNodeArray } from 'react';
import classnames from 'classnames';

type FieldGroupProps = {
  children: ReactNode | ReactNodeArray;
  className?: string;
  error?: boolean;
  scrollElement?: string;
};
const FieldGroup = ({
  children,
  className,
  error,
  scrollElement
}: FieldGroupProps) => {
  const fieldGroupClasses = classnames(
    'usa-form-group',
    { 'usa-form-group--error': error },
    className
  );
  return (
    <div className={fieldGroupClasses} data-scroll={scrollElement}>
      {children}
    </div>
  );
};

export default FieldGroup;
