/*
Custom mocked provider for apollo client's MockedProvider
OOB component has severely limited logging, this custom component makes it easier to debug
gql queries/mutations within tests
Borrowed from - https://www.swarmia.com/blog/debugging-apollo-graphql-mockedprovider/
*/

import React from 'react';
import { ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import {
  MockedProvider,
  MockedProviderProps,
  MockedResponse,
  MockLink
} from '@apollo/client/testing';

interface Props extends MockedProviderProps {
  mocks?: ReadonlyArray<MockedResponse>;
  children?: React.ReactElement;
}

const VerboseMockedProvider = (props: Props) => {
  const { mocks = [], ...otherProps } = props;

  const mockLink = new MockLink(mocks);
  const errorLoggingLink = onError(({ graphQLErrors, networkError }) => {
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
    }

    if (networkError && !!networkError.message) {
      console.log(`[Network error]: ${networkError}`);
    }
  });
  // @ts-ignore
  const link = ApolloLink.from([errorLoggingLink, mockLink]);

  return (
    <MockedProvider
      addTypename={false}
      {...otherProps}
      mocks={mocks}
      link={link}
    />
  );
};

export default VerboseMockedProvider;
