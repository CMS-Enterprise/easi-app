/*
Custom mocked provider for apollo client's MockedProvider
OOB component has severely limited logging, this custom component makes it easier to debug
gql queries/mutations within tests
Borrowed from - https://www.swarmia.com/blog/debugging-apollo-graphql-mockedprovider/
*/

import React, { useState } from 'react';
import { ApolloLink, Operation } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import {
  MockedProvider,
  MockedProviderProps,
  MockedResponse,
  MockLink
} from '@apollo/client/testing';
import i18next from 'i18next';
import { getCurrentErrorMeta } from 'wrappers/ErrorContext/errorMetaStore';

import Alert from 'components/Alert';

/**
 * Helper function to determine operation type (from production error handler)
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

interface Props extends MockedProviderProps {
  mocks?: ReadonlyArray<MockedResponse>;
  children?: React.ReactElement;
}

// Global error state for tests
let testErrorSetter: ((msg: string | null) => void) | null = null;

const VerboseMockedProvider = (props: Props) => {
  const { mocks = [], children, ...otherProps } = props;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Register the error setter globally
  React.useEffect(() => {
    testErrorSetter = setErrorMsg;
    return () => {
      testErrorSetter = null;
    };
  }, []);

  const mockLink = new MockLink(mocks, true); // addTypename = true for second param

  const errorMessages = i18next.t<Record<string, string>>(
    'error:operationErrors',
    { returnObjects: true }
  );

  const errorLoggingLink = onError(
    ({ graphQLErrors, networkError, operation }) => {
      const operationType = getOperationType(operation);
      const { operationName } = operation;

      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          /* eslint-disable no-console */
          console.log(
            '[GraphQL error]:' +
              `Message: ${message},` +
              `Location: ${locations},` +
              `Path: ${path}`
          )
        );

        // Only display errors for mutations (not queries) to match production behavior
        if (operationType === 'mutation' && testErrorSetter) {
          const { overrideMessage } = getCurrentErrorMeta();

          // Priority: overrideMessage > i18n message > GraphQL error message
          const displayMessage =
            overrideMessage ||
            errorMessages[operationName] ||
            graphQLErrors[0]?.message;

          if (displayMessage) {
            testErrorSetter(
              typeof displayMessage === 'string'
                ? displayMessage
                : 'An error occurred' // Fallback for ReactNode overrideMessages
            );
          }
        }
      }

      if (networkError && !!networkError.message) {
        console.log(`[Network error]: ${networkError}`);

        // Only display errors for mutations (not queries) to match production behavior
        if (operationType === 'mutation' && testErrorSetter) {
          const { overrideMessage } = getCurrentErrorMeta();

          // Priority: overrideMessage > i18n message > fallback message
          const displayMessage =
            overrideMessage ||
            errorMessages[operationName] ||
            'A network error occurred. Please try again.';

          testErrorSetter(
            typeof displayMessage === 'string'
              ? displayMessage
              : 'A network error occurred. Please try again.' // Fallback for ReactNode overrideMessages
          );
        }
      }
    }
  );
  // @ts-ignore
  const link = ApolloLink.from([errorLoggingLink, mockLink]);

  return (
    <MockedProvider
      addTypename={false}
      {...otherProps}
      mocks={mocks}
      link={link}
    >
      <>
        {errorMsg && (
          <Alert type="error" data-testid="test-error-message">
            {errorMsg}
          </Alert>
        )}
        {children}
      </>
    </MockedProvider>
  );
};

export default VerboseMockedProvider;
