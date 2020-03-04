import React from 'react';

type FieldErrorMsgProps = {
  errorMsg: string;
};
const FieldErrorMsg = ({ errorMsg }: FieldErrorMsgProps) => {
  if (errorMsg) {
    return (
      <span className="usa-error-message" role="alert">
        {errorMsg}
      </span>
    );
  }
  return null;
};

export default FieldErrorMsg;
