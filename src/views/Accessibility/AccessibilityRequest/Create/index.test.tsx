import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';
import GetAccessibilityRequestAccessibilityTeamOnlyQuery from 'queries/GetAccessibilityRequestAccessibilityTeamOnlyQuery';
import GetSystemsQuery from 'queries/GetSystems';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import AccessibilityRequestDetailPage from 'views/Accessibility/AccessibilityRequestDetailPage';

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

  const create508Request = {
    request: {
      query: CreateAccessibilityRequestQuery,
      variables: {
        input: {
          name: 'TACO',
          intakeID: '702af838-15be-4ddd-adf0-d99fc55a1eca'
        }
      }
    },
    result: {
      data: {
        createAccessibilityRequest: {
          accessibilityRequest: {
            id: 'bc142c4d-fc41-499c-ac31-482d6eb09e01',
            name: 'TACO'
          },
          userErrors: null
        }
      }
    }
  };

  const get508RequestQuery = {
    request: {
      query: GetAccessibilityRequestAccessibilityTeamOnlyQuery,
      variables: {
        id: 'bc142c4d-fc41-499c-ac31-482d6eb09e01'
      }
    },
    result: {
      data: {
        accessibilityRequest: {
          id: 'bc142c4d-fc41-499c-ac31-482d6eb09e01',
          name: 'TACO',
          submittedAt: '2021-07-13T02:09:00Z',
          euaUserId: 'AAAA',
          documents: [],
          notes: [],
          testDates: [],
          statusRecord: {
            status: 'OPEN',
            submittedAt: '2021-07-13T02:09:00Z'
          },
          system: {
            id: '702af838-15be-4ddd-adf0-d99fc55a1eca',
            name: 'TACO'
          }
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

  it('can created a 508 testing request', async () => {
    window.scrollTo = jest.fn();

    render(
      <MemoryRouter initialEntries={['/508/requests/new']}>
        <MessageProvider>
          <MockedProvider
            mocks={[defaultQuery, create508Request, get508RequestQuery]}
            addTypename={false}
          >
            <Provider store={defaultStore}>
              <Route path="/508/requests/new">
                <Create />
              </Route>
              <Route path="/508/requests/:accessibilityRequestId/documents">
                <AccessibilityRequestDetailPage />
              </Route>
            </Provider>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

    const comboBoxInput = screen.getByRole('combobox', {
      name: /application/i
    });
    userEvent.type(comboBoxInput, 'TACO - 000000{enter}');
    expect(comboBoxInput).toHaveValue('TACO - 000000');

    screen.getByRole('button', { name: /send 508 testing request/i }).click();
    await screen.findByTestId('page-loading');

    expect(
      screen.getByText(/508 testing request created/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: /TACO/i })
    ).toBeInTheDocument();
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
