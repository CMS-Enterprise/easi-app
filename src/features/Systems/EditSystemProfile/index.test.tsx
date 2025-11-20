import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GetCedarSystemDocument,
  GetCedarSystemQuery,
  GetCedarSystemQueryVariables
} from 'gql/generated/graphql';

import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import EditSystemProfile from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

const cedarSystem: GetCedarSystemQuery['cedarSystem'] = {
  __typename: 'CedarSystem',
  id: '{11AB1A00-1234-5678-ABC1-1A001B00CC1B}',
  name: 'Office of Funny Walks',
  description:
    'Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.',
  acronym: 'OFW',
  status: null,
  businessOwnerOrg: 'Information Systems Team',
  businessOwnerOrgComp: 'IST',
  systemMaintainerOrg: 'Division of Quality Assurance',
  systemMaintainerOrgComp: 'DQA',
  isBookmarked: false,

  // testing
  idAsUUID: '11AB1A00-1234-5678-ABC1-1A001B00CC1B'
};

const getCedarSystemQuery: MockedQuery<
  GetCedarSystemQuery,
  GetCedarSystemQueryVariables
> = {
  request: {
    query: GetCedarSystemDocument,
    variables: {
      id: '000-100-0'
    }
  },
  result: {
    data: {
      __typename: 'Query',
      cedarSystem
    }
  }
};

const store = easiMockStore();

describe('EditSystemProfile', () => {
  it('renders the system name', async () => {
    render(
      <Provider store={store}>
        <VerboseMockedProvider mocks={[getCedarSystemQuery]}>
          <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
            <Route path="/systems/:systemId/edit">
              <EditSystemProfile />
            </Route>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    await screen.findByText(`for ${cedarSystem.name}`);
  });

  it('renders page not found for invalid system id', async () => {
    const invalidCedarSystemQuery: MockedQuery<
      GetCedarSystemQuery,
      GetCedarSystemQueryVariables
    > = {
      request: {
        query: GetCedarSystemDocument,
        variables: {
          id: 'invalid'
        }
      },
      result: {
        data: {
          __typename: 'Query',
          cedarSystem: null
        }
      }
    };

    render(
      <Provider store={store}>
        <VerboseMockedProvider mocks={[invalidCedarSystemQuery]}>
          <MemoryRouter initialEntries={['/systems/invalid/edit']}>
            <Route path="/systems/:systemId/edit">
              <EditSystemProfile />
            </Route>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    await screen.findByRole('heading', { name: 'This page cannot be found.' });
  });
});
