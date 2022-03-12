import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';
import GetAccessibilityRequestAccessibilityTeamOnlyQuery from 'queries/GetAccessibilityRequestAccessibilityTeamOnlyQuery';
import GetCedarSystemIdsQuery from 'queries/GetCedarSystemIdsQuery';
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
      query: GetCedarSystemIdsQuery
    },
    result: {
      data: {
        cedarSystems: [
          {
            id: '000-0000-1',
            name: 'Application Programming Interface Gateway'
          },
          {
            id: '000-0000-2',
            name: 'Blueprint'
          },
          {
            id: '000-0000-3',
            name: 'Value Based Care Management System'
          },
          {
            id: '000-0000-4',
            name: 'CMS Operations Information Network'
          }
        ]
      }
    }
  };

  const errorQuery = {
    request: {
      query: GetCedarSystemIdsQuery
    },
    error: new Error('bad request')
  };

  const create508Request = {
    request: {
      query: CreateAccessibilityRequestQuery,
      variables: {
        input: {
          name: 'CMS Operations Information Network',
          cedarSystemId: '000-0000-4'
        }
      }
    },
    result: {
      data: {
        createAccessibilityRequest: {
          accessibilityRequest: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'CMS Operations Information Network'
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
        id: '00000000-0000-0000-0000-000000000001'
      }
    },
    result: {
      data: {
        accessibilityRequest: {
          id: '00000000-0000-0000-0000-000000000001',
          euaUserId: 'AAAA',
          submittedAt: '2022-03-11T13:52:39.534086Z',
          name: 'CMS Operations Information Network',
          system: null,
          documents: [],
          testDates: [],
          statusRecord: {
            status: 'OPEN'
          },
          notes: []
        }
      }
    }
  };

  const submitTextMatch = /send 508 testing request/i;

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

    expect(screen.getByTestId('create-508-request')).toBeInTheDocument();
    expect(screen.getByText(submitTextMatch)).toHaveAttribute('disabled');

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('cedar-systems-loading')
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('can create a 508 testing request', async () => {
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

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('cedar-systems-loading')
    );

    const cedarSystemsInput = await screen.findByTestId('combo-box-input');
    userEvent.type(cedarSystemsInput, 'cms');
    userEvent.click(await screen.findByTestId('combo-box-option-000-0000-4'));
    expect(cedarSystemsInput).toHaveValue('CMS Operations Information Network');

    userEvent.click(screen.getByText(submitTextMatch));

    await screen.findByTestId('page-loading');
    await waitFor(() => {
      expect(screen.queryByTestId('page-loading')).not.toBeInTheDocument();
    });
    expect(
      screen.getByText(/508 testing request created/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /CMS Operations Information Network/i
      })
    ).toBeInTheDocument();
  });

  it('renders loading error warning alert', async () => {
    render(
      <MemoryRouter initialEntries={['/508/requests/new']}>
        <MessageProvider>
          <MockedProvider mocks={[errorQuery]} addTypename={false}>
            <Provider store={defaultStore}>
              <Route path="/508/requests/new">
                <Create />
              </Route>
            </Provider>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText(/issues loading data/i)).toBeInTheDocument();
    expect(await screen.findByTestId('combo-box-input')).toHaveAttribute(
      'disabled'
    );
    expect(screen.getByText(submitTextMatch)).toHaveAttribute('disabled');
  });
});
