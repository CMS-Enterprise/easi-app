import React from 'react';

const ErrorAlert = ({ heading, children }: any) => (
  <div className="usa-alert usa-alert--error" role="alert">
    <div className="usa-alert__body">
      <h3 className="usa-alert__heading">{heading}</h3>
      {children}
    </div>
  </div>
);

export default ErrorAlert;
