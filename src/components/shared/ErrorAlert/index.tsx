import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';

import './index.scss';

type ErrorAlertProps = {
  heading: string;
  children: React.ReactNode | React.ReactNodeArray;
  classNames?: string;
  testId?: string;
  /** Whether to autoFocus alert on error - defaults to true */
  autoFocus?: boolean;
};
export const ErrorAlert = ({
  heading,
  children,
  classNames,
  testId,
  autoFocus = true
}: ErrorAlertProps) => {
  const errorAlertClasses = classnames(
    'usa-alert',
    'usa-alert--error',
    classNames
  );

  const headingEl = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const { current } = headingEl;
    if (current && autoFocus) {
      current.focus();
    }
  }, [autoFocus]);

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

type ReactHookFormsErrorAlertMessageProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  message: string;
};

export const ErrorAlertMessage = (
  props: ErrorAlertMessageProps | ReactHookFormsErrorAlertMessageProps
) => {
  const { message } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    if ('errorKey' in props) {
      const { errorKey } = props;

      // Scroll to fieldGroup
      const fieldGroup = document.querySelector(`[data-scroll="${errorKey}"]`);
      if (fieldGroup) {
        fieldGroup.scrollIntoView();
      }

      // Focus input
      const fieldEl: HTMLElement | null = document.querySelector(
        `[name="${errorKey}"]`
      );
      if (fieldEl) {
        fieldEl.focus();
      }
    } else {
      // If `errorKey` prop is undefined, execute onClick
      const { onClick } = props;
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      className="usa-error-message usa-alert__text easi-error-alert__message"
      onClick={handleClick}
    >
      {message}
    </button>
  );
};
