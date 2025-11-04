// MessageContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Alert from 'components/Alert';

import { setCurrentErrorMeta } from './errorMetaStore';
import { setCurrentSuccessMeta } from './successMetaStore';

type ErrorMeta = {
  overrideMessage?: string | React.ReactNode;
  skipError?: boolean;
};

type SuccessMeta = {
  overrideMessage?: string | React.ReactNode;
  skipSuccess?: boolean;
};

// Combined MessageContext for both error and success messages
const MessageContext = createContext<{
  errorMeta: ErrorMeta;
  setErrorMeta: (meta: ErrorMeta) => void;
  successMeta: SuccessMeta;
  setSuccessMeta: (meta: SuccessMeta) => void;
}>({
  errorMeta: {},
  setErrorMeta: () => {},
  successMeta: {},
  setSuccessMeta: () => {}
});

// Hook for setting error messages
export const useErrorMessage = (
  message?: string | React.ReactNode,
  skipError?: boolean
) => {
  const { setErrorMeta } = useContext(MessageContext);

  useEffect(() => {
    if (message) {
      setErrorMeta({ overrideMessage: message, skipError });
    }
  }, [message, setErrorMeta, skipError]);

  return useContext(MessageContext);
};

// Hook for setting success messages
export const useSuccessMessage = (
  message?: string | React.ReactNode,
  skipSuccess?: boolean
) => {
  const { setSuccessMeta } = useContext(MessageContext);

  useEffect(() => {
    if (message) {
      setSuccessMeta({ overrideMessage: message, skipSuccess });
    }
  }, [message, setSuccessMeta, skipSuccess]);

  return useContext(MessageContext);
};

/**
 * statusAlert
 *
 * A toast notification that displays a status message.
 */
export const statusAlert = ({
  message,
  timeout,
  type = 'success'
}: {
  message?: string | React.ReactNode;
  timeout?: number;
  type?: 'success' | 'error' | 'warning';
}) => {
  // Use shorter timeout in Cypress tests to prevent toasts from covering elements
  const defaultTimeout = (window as any).Cypress ? 500 : 5000;

  const generalMessage =
    type === 'error'
      ? 'Something went wrong with your request. Please try again.'
      : 'The operation was successful';

  return toast[type](
    <Alert type={type} isClosable={false}>
      {message || generalMessage}
    </Alert>,
    {
      autoClose: timeout ?? defaultTimeout,
      hideProgressBar: true
    }
  );
};

/**
 * MessageProvider
 *
 * A combined provider that allows components to set and retrieve both error and success
 * message overrides without needing to pass props through multiple component layers.
 * The provider maintains state for both error and success metadata and provides setter functions.
 */
export const MessageMetaProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [errorMeta, setErrorMeta] = useState<ErrorMeta>({});
  const [successMeta, setSuccessMeta] = useState<SuccessMeta>({});

  useEffect(() => {
    setCurrentErrorMeta(errorMeta);
  }, [errorMeta]);

  useEffect(() => {
    setCurrentSuccessMeta(successMeta);
  }, [successMeta]);

  return (
    <MessageContext.Provider
      value={{ errorMeta, setErrorMeta, successMeta, setSuccessMeta }}
    >
      {children}
    </MessageContext.Provider>
  );
};

// Backward compatibility - export as ErrorMessageProvider
export const ErrorMessageProvider = MessageMetaProvider;

export default MessageMetaProvider;
