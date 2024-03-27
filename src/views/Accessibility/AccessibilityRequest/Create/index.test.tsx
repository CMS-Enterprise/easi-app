import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import GetSystemsQuery from 'queries/GetSystems';

import Create from './index';

describe('Create 508 Request page', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA',
      groups: ['EASI_D_508_USER']
    }
  });

  const defaultQuery = {
    request: {
      query: GetSystemsQuery,
      variables: {
        first: 20
      }
    },
    result: {
      data: {
        systems: {
          edges: [
            {
              node: {
                id: '702af838-15be-4ddd-adf0-d99fc55a1eca',
                name: 'TACO',
                lcid: '000000',
                businessOwner: {
                  name: 'Shelly Smith',
                  component: 'OIT'
                }
              }
            },
            {
              node: {
                id: 'd4a54864-e842-49b7-9b60-64fdbba38e39',
                name: 'Big Project',
                lcid: '000001',
                businessOwner: {
                  name: 'Ross Strickland',
                  component: 'CMCS'
                }
              }
            },
            {
              node: {
                id: 'cdbf4c59-37ea-4142-a128-af562225effc',
                name: 'Easy Access to System Information',
                lcid: '000002',
                businessOwner: {
                  name: 'Shane Clark',
                  component: 'OIT'
                }
              }
            }
          ]
        }
      }
    }
  };

  const waitForPageLoad = async () => {
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
  };

  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/508/requests/new']}>
        <MessageProvider>
          <MockedProvider mocks={[defaultQuery]} addTypename={false}>
            <Provider store={defaultStore}>
              <Route path="/508/requests/new">
                <Create />
              </Route>
            </Provider>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

    expect(screen.getByTestId('create-508-request')).toBeInTheDocument();
  });

  it('renders validation errors', async () => {
    render(
      <MemoryRouter initialEntries={['/508/requests/new']}>
        <MessageProvider>
          <MockedProvider mocks={[defaultQuery]} addTypename={false}>
            <Provider store={defaultStore}>
              <Route path="/508/requests/new">
                <Create />
              </Route>
            </Provider>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

    screen.getByRole('button', { name: /send 508 testing request/i }).click();
    expect(await screen.findByTestId('508-request-errors')).toBeInTheDocument();
  });
});
