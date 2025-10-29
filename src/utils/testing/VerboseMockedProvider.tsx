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

  const errorLoggingLink = onError(
    ({ graphQLErrors, networkError, operation }) => {
      const operationType = getOperationType(operation);
      const { operationName } = operation;

      // Error messages map (matches production error handler)
      const errorMessages: Record<string, string> = {
        CreateTRBAdminNoteGeneralRequest:
          'There was a problem saving your note. Please try again. If the error persists, please try again at a later date.',
        CreateTRBAdminNoteSupportingDocuments:
          'There was a problem saving your note. Please try again. If the error persists, please try again at a later date.',
        UpdateTRBRequestConsultMeeting:
          'There was an issue scheduling the consult session. Please try again, and if the problem persists, try again later.',
        CreateTRBRequestDocument:
          'There was an issue uploading your document. Please try again, and if the problem persists, try again later.',
        CreateTRBRequestFeedback:
          'There was an issue completing the request edits action. Please try again, and if the problem persists, try again later.',
        CloseTRBRequest:
          'There was an issue closing this request. Please try again, and if the problem persists, try again later.',
        ReopenTRBRequest:
          'There was an issue re-opening this request. Please try again, and if the problem persists, try again later.',
        UpdateTRBRequestLead:
          'There was an issue assigning a TRB lead for this request. Please try again, and if the problem persists, try again later.',
        SendPresentationDeckReminder:
          'There was an issue sending the reminder. Please try again.'
      };

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
        if (
          operationType === 'mutation' &&
          errorMessages[operationName] &&
          testErrorSetter
        ) {
          testErrorSetter(errorMessages[operationName]);
        }
      }

      if (networkError && !!networkError.message) {
        console.log(`[Network error]: ${networkError}`);

        // Only display errors for mutations (not queries) to match production behavior
        if (operationType === 'mutation' && testErrorSetter) {
          const newErrorMessage =
            errorMessages[operationName] ||
            'A network error occurred. Please try again.';
          testErrorSetter(newErrorMessage);
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
