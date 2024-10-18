/*
Wrapper for Truss' <Alert> component to allow for manually closing the component
*/

import React, { useEffect, useState } from 'react';
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

export type AlertProps = {
  type: 'success' | 'warning' | 'error' | 'info';
  heading?: React.ReactNode;
  children?: React.ReactNode;
  'data-testid'?: string;
  slim?: boolean;
  noIcon?: boolean;
  inline?: boolean;
  isClosable?: boolean;
  closeAlert?: (value: any) => any;
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
  closeAlert,
  ...props
}: AlertProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const classes = classnames(
    {
      'easi-inline-alert': inline,
      'easi-alert-text': isClosable
    },
    className
  );

  const [isClosed, setClosed] = useState<boolean>(false);

  // closeAlert is a state setter passed down to conditionally render alert component from parent
  useEffect(() => {
    if (closeAlert && isClosed) closeAlert(false);
  }, [isClosed, closeAlert]);

  return (
    <>
      {!isClosed && (
        <TrussAlert
          type={type}
          heading={heading}
          slim={slim}
          noIcon={noIcon}
          className={classes}
          headingLevel="h4"
          {...props}
        >
          {children}
          {isClosable && (
            <Button
              type="button"
              role="button"
              className="easi-alert__close-button text-black text-no-underline margin-top-0"
              tabIndex={0}
              aria-label="Close Button"
              onClick={() => setClosed(true)}
              unstyled
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
