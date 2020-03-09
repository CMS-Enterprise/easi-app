import React from 'react';
import './index.scss';

type ErrorAlertProps = {
  heading: string;
  children: React.ReactNode | React.ReactNodeArray;
};
export const ErrorAlert = ({ heading, children }: ErrorAlertProps) => (
  <div className="usa-alert usa-alert--error" role="alert">
    <div className="usa-alert__body">
      <h3 className="usa-alert__heading">{heading}</h3>
      {children}
    </div>
  </div>
);

type ErrorAlertMessageProps = {
  message: string;
  onClick?: () => void;
};
export const ErrorAlertMessage = ({
  message,
  onClick
}: ErrorAlertMessageProps) => (
  <button
    type="button"
    className="usa-error-message usa-alert__text easi-error-alert__message"
    onClick={onClick}
  >
    {message}
  </button>
);
