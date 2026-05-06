import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { GetSystemIntakeRelationDocument } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RequestLinkForm from '.';

describe('IT Gov Request relation link form', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'AAAA',
      isUserSet: true
    }
  });

  const renderRequestLinkForm = ({
    viewerIsRequester = true,
    fromAdmin = false
  } = {}) => {
    const id = 'fa93173c-2e8c-4371-b464-4b3dd649f940';

    return render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            fromAdmin
              ? `/it-governance/${id}/system-information/link`
              : `/system/link/${id}`
          ]}
        >
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
                      viewerIsRequester,
                      relationType: null,
                      contractName: null,
                      requester: {
                        __typename: 'SystemIntakeContact',
                        userAccount: {
                          __typename: 'UserAccount',
                          username: 'AAAA'
                        }
                      },
                      contractNumbers: [],
                      systems: [],
                      __typename: 'SystemIntake'
                    },
                    cedarSystems: [
                      {
                        id: '{11AB1A00-1234-5678-ABC1-1A001B00CC0A}',
                        name: 'Centers for Management Services',
                        __typename: 'CedarSystem',
                        acronym: 'CMS'
                      }
                    ]
                  }
                }
              }
            ]}
            addTypename={false}
          >
            <Route
              path={
                fromAdmin
                  ? '/it-governance/:id/system-information/link'
                  : '/system/link/:id?'
              }
            >
              <RequestLinkForm requestType="itgov" fromAdmin={fromAdmin} />
            </Route>
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders', async () => {
    const { asFragment } = renderRequestLinkForm();

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders page not found for a non-requester outside the admin route', async () => {
    renderRequestLinkForm({ viewerIsRequester: false });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('heading', {
      level: 1,
      name: 'This page cannot be found.'
    });
  });

  it('renders for a non-requester when the admin wrapper passes fromAdmin', async () => {
    renderRequestLinkForm({ viewerIsRequester: false, fromAdmin: true });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('button', { name: 'Save changes' });
  });
});
