// ErrorMessageContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Alert from 'components/Alert';

import { setCurrentErrorMeta } from './errorMetaStore';

type ErrorMeta = {
  overrideMessage?: string | React.ReactNode;
  skipError?: boolean;
};

// ErrorMessageContext is used to provide the error message to the component
const ErrorMessageContext = createContext<{
  errorMeta: ErrorMeta;
  setErrorMeta: (meta: ErrorMeta) => void;
}>({
  errorMeta: {},
  setErrorMeta: () => {}
});

// Hook that accepts a message directly
export const useErrorMessage = (
  message?: string | React.ReactNode,
  skipError?: boolean
) => {
  const { setErrorMeta } = useContext(ErrorMessageContext);

  useEffect(() => {
    if (message) {
      setErrorMeta({ overrideMessage: message, skipError });
    }
  }, [message, setErrorMeta, skipError]);

  return useContext(ErrorMessageContext);
};

/**
 * statusAlert
 *
 * A toast notification that displays a status message.
 */
export const statusAlert = ({
  message,
  timeout = 5000,
  type = 'success'
}: {
  message?: string | React.ReactNode;
  timeout?: number;
  type?: 'success' | 'error' | 'warning';
}) => {
  const generalMessage =
    type === 'error'
      ? 'Something went wrong with your request. Please try again.'
      : 'The operation was successful';

  return toast[type](
    <Alert type={type} isClosable={false}>
      {message || generalMessage}
    </Alert>,
    {
      autoClose: timeout || 5000,
      hideProgressBar: true
    }
  );
};

/**
 * ErrorMessageProvider
 *
 * A provider that allows components to set and retrieve error message overrides
 * without needing to pass props through multiple component layers. The provider
 * maintains a state of the current error metadata and provides a setter function
 */

// ErrorMessageProvider is used to provide the error message to the component
export const ErrorMessageProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [errorMeta, setErrorMeta] = useState<ErrorMeta>({});

  useEffect(() => {
    setCurrentErrorMeta(errorMeta);
  }, [errorMeta]);

  return (
    <ErrorMessageContext.Provider value={{ errorMeta, setErrorMeta }}>
      {children}
    </ErrorMessageContext.Provider>
  );
};

export default ErrorMessageProvider;
