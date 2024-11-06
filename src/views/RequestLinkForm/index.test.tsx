import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { GetSystemIntakeRelationDocument } from 'gql/gen/graphql';
import configureMockStore from 'redux-mock-store';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RequestLinkForm from '.';

describe('IT Gov Request relation link form', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'AAAA'
    }
  });

  it('renders', async () => {
    const id = 'fa93173c-2e8c-4371-b464-4b3dd649f940';
    const { asFragment } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/system/link/${id}`]}>
          <VerboseMockedProvider
            mocks={[
              {
                request: {
                  query: GetSystemIntakeRelationDocument,
                  variables: {
                    id
                  }
                },
                result: {
                  data: {
                    systemIntake: {
                      id,
                      relationType: null,
                      contractName: null,
                      contractNumbers: [],
                      systems: [],
                      __typename: 'SystemIntake'
                    },
                    cedarSystems: [
                      {
                        id: '{11AB1A00-1234-5678-ABC1-1A001B00CC0A}',
                        name: 'Centers for Management Services',
                        __typename: 'CedarSystem'
                      }
                    ]
                  }
                }
              }
            ]}
            addTypename={false}
          >
            <Route path="/system/link/:id?">
              <RequestLinkForm requestType="itgov" />
            </Route>
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
