import React from 'react';

import './index.scss';

type ConfirmationMessageProps = {
  children: React.ReactNode;
};

const ConfirmationMessage = ({ children }: ConfirmationMessageProps) => {
  return (
    <div className="easi-confirmation-message">
      <div className="fa fa-check-circle fa-2x margin-left-3 margin-right-2" />
      <p role="alert" className="margin-0">
        {children}
      </p>
    </div>
  );
};

export default ConfirmationMessage;
