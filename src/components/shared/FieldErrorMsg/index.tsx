import React from 'react';

type FieldErrorMsgProps = {
  children?: React.ReactNode;
};
const FieldErrorMsg = ({ children }: FieldErrorMsgProps) => {
  if (children) {
    return (
      <span className="usa-error-message" role="alert">
        {children}
      </span>
    );
  }
  return null;
};

export default FieldErrorMsg;
