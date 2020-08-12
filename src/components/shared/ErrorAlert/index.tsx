import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';

import './index.scss';

type ErrorAlertProps = {
  heading: string;
  children: React.ReactNode | React.ReactNodeArray;
  classNames?: string;
  testId?: string;
};
export const ErrorAlert = ({
  heading,
  children,
  classNames,
  testId
}: ErrorAlertProps) => {
  const errorAlertClasses = classnames(
    'usa-alert',
    'usa-alert--error',
    classNames
  );

  const headingEl = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const { current } = headingEl;
    if (current) {
      current.focus();
    }
  }, []);

  return (
    <div className={errorAlertClasses} role="alert" data-testid={testId}>
      <div className="usa-alert__body">
        <h3 className="usa-alert__heading" tabIndex={-1} ref={headingEl}>
          {heading}
        </h3>
        {children}
      </div>
    </div>
  );
};

type ErrorAlertMessageProps = {
  errorKey: string;
  message: string;
};
export const ErrorAlertMessage = ({
  errorKey,
  message
}: ErrorAlertMessageProps) => (
  <button
    type="button"
    className="usa-error-message usa-alert__text easi-error-alert__message"
    onClick={() => {
      const fieldGroup = document.querySelector(`[data-scroll="${errorKey}"]`);

      if (fieldGroup) {
        fieldGroup.scrollIntoView();
      }

      const fieldEl: HTMLElement | null = document.querySelector(
        `[name="${errorKey}"]`
      );

      if (fieldEl) {
        fieldEl.focus();
      }
    }}
  >
    {message}
  </button>
);
