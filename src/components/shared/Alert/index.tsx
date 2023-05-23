/*
Wrapper for Truss' <Alert> component to allow for manually closing the component
*/

import React, { useState } from 'react';
import { Alert as TrussAlert, Button } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type AlertTextProps = {
  className?: string;
  children: React.ReactNode;
} & JSX.IntrinsicElements['p'];

export const AlertText = ({
  className,
  children,
  ...props
}: AlertTextProps) => {
  return (
    <p className={classnames('usa-alert__text', className)} {...props}>
      {children}
    </p>
  );
};

type AlertProps = {
  type: 'success' | 'warning' | 'error' | 'info';
  heading?: React.ReactNode;
  children?: React.ReactNode;
  'data-testid'?: string;
  slim?: boolean;
  noIcon?: boolean;
  inline?: boolean;
  isClosable?: boolean;
} & JSX.IntrinsicElements['div'];

export const Alert = ({
  type,
  heading,
  children,
  slim = type === 'success' || type === 'error',
  noIcon,
  className,
  inline,
  // Default to closable button if type = success or error
  isClosable = type === 'success' || type === 'error',
  ...props
}: AlertProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const classes = classnames(
    {
      'easi-inline-alert': inline,
      'easi-alert-text': isClosable
    },
    'flex',
    className
  );

  const [isClosed, setClosed] = useState<boolean>(false);

  return (
    <>
      {!isClosed && (
        <TrussAlert
          type={type}
          heading={heading}
          slim={slim}
          noIcon={noIcon}
          className={classes}
          {...props}
        >
          <div>{children}</div>
          {isClosable && (
            <Button
              type="button"
              role="button"
              className={classnames(
                'usa-button usa-button--unstyled text-no-underline text-black',
                { 'margin-top-neg-4': heading },
                { 'margin-top-05': !heading }
              )}
              tabIndex={0}
              aria-label="Close Button"
              onClick={() => setClosed(true)}
            >
              &#10005;
            </Button>
          )}
        </TrussAlert>
      )}
    </>
  );
};

export default Alert;
