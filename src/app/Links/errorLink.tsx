import React from 'react';
import { toast } from 'react-toastify';
import { Operation } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import i18next from 'i18next';
import {
  getCurrentErrorMeta,
  setCurrentErrorMeta
} from 'wrappers/ErrorContext/errorMetaStore';

import Alert from 'components/Alert';

/**
 * Helper function to determine operation type
 */
function getOperationType(
  operation: Operation
): 'query' | 'mutation' | 'subscription' | 'unknown' {
  try {
    const definition = operation.query.definitions[0];
    if (definition?.kind === 'OperationDefinition') {
      return definition.operation || 'unknown';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

const findKnownError = (
  errorMessage: string,
  knownErrors: Record<string, string>
): string | undefined => {
  return Object.keys(knownErrors).find(key => errorMessage.includes(key));
};

/**
 * Error Link
 *
 * A link that intercepts GraphQL errors and displays them in a toast notification.
 * It also allows for overriding the error message for a specific component.
 */
const errorLink = onError(({ graphQLErrors, operation, networkError }) => {
  // Use shorter timeout in Cypress tests to prevent toasts from covering elements
  const toastTimeout = (window as any).Cypress ? 100 : 5000;

  const operationErrorMap = i18next.t<Record<string, string>>(
    'error:operationErrors',
    { returnObjects: true }
  );

  const knownErrorMap = i18next.t<Record<string, string>>('error:knownErrors', {
    returnObjects: true
  });

  /** Handle GraphQL errors */
  if (graphQLErrors) {
    const { overrideMessage, skipError } = getCurrentErrorMeta();
    const isReactNode = React.isValidElement(overrideMessage);
    const operationType = getOperationType(operation);

    graphQLErrors.forEach(err => {
      let knownErrorMessage = '';

      let knownError: string | undefined;

      // Handle different operation types if needed
      switch (operationType) {
        case 'mutation':
          if (operationErrorMap[operation.operationName]) {
            knownErrorMessage = operationErrorMap[operation.operationName];
          } else {
            knownError = findKnownError(err.message, knownErrorMap);
            knownErrorMessage = knownError
              ? knownErrorMap[knownError]
              : knownErrorMessage;
          }
          break;
        default:
          knownErrorMessage = '';
      }

      if (operationType === 'mutation' && !skipError) {
        toast.error(
          <div>
            {isReactNode ? (
              overrideMessage
            ) : (
              <Alert
                type="error"
                slim={false}
                heading={i18next.t<string>('error:global.generalError')}
                isClosable={false}
              >
                <p className="margin-0">
                  {overrideMessage || knownErrorMessage}
                </p>
                <p className="margin-0">
                  {i18next.t<string>('error:global.generalBody')}
                </p>
              </Alert>
            )}
          </div>,
          { autoClose: toastTimeout }
        );

        // Clear the override message after displaying the error
        setCurrentErrorMeta({});
      }
    });
  }

  // Handle network errors (SERVER DOWN, etc.)
  if (networkError && !graphQLErrors) {
    const operationType = getOperationType(operation);

    // Only show toast for mutations
    if (operationType === 'mutation') {
      toast.error(
        <Alert
          type="error"
          slim={false}
          heading={i18next.t<string>('error:global.networkError.heading')}
          isClosable={false}
        >
          <p className="margin-0">
            {i18next.t<string>('error:global.networkError.body')}
          </p>
        </Alert>,
        { autoClose: toastTimeout }
      );
    }
  }
});

export default errorLink;
