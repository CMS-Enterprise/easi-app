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

// import userEvent from '@testing-library/user-event';
import {
  ACCESSIBILITY_ADMIN_DEV,
  ACCESSIBILITY_TESTER_DEV
} from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';
import GetAccessibilityRequestsQuery from 'queries/GetAccessibilityRequestsQuery';

import AccessibilityRequestListPage from './index';

describe('Accessibility Request List page', () => {
  const mockStore = configureMockStore();
  const testerStore = mockStore({
    auth: { groups: [ACCESSIBILITY_TESTER_DEV], isUserSet: true }
  });
  const adminStore = mockStore({
    auth: { groups: [ACCESSIBILITY_ADMIN_DEV], isUserSet: true }
  });

  const default508RequestsQuery = {
    request: {
      query: GetAccessibilityRequestsQuery,
      variables: {
        first: 20
      }
    },
    result: {
      data: {
        accessibilityRequests: {
          edges: [
            {
              node: {
                id: 'a11yRequest123',
                name: 'My Special Request',
                relevantTestDate: { date: new Date().toISOString() },
                submittedAt: new Date().toISOString(),
                system: {
                  lcid: '123456',
                  businessOwner: { name: 'Clark Kent', component: 'OIT' }
                },
                statusRecord: {
                  status: 'OPEN',
                  createdAt: new Date().toISOString()
                }
              }
            },
            {
              node: {
                id: 'a11yRequest543',
                relevantTestDate: { date: new Date().toISOString() },
                submittedAt: new Date().toISOString(),
                name: 'My Other Special Request',
                system: {
                  lcid: '654321',
                  businessOwner: { name: 'Jayla Doe', component: 'OIT' }
                },
                statusRecord: {
                  status: 'OPEN',
                  createdAt: new Date().toISOString()
                }
              }
            }
          ]
        }
      }
    }
  };

  const render508RequestListPage = (mocks: any[], store: any) =>
    render(
      <MemoryRouter initialEntries={['/']}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/">
              <MessageProvider>
                <AccessibilityRequestListPage />
              </MessageProvider>
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

  it('renders without errors', async () => {
    render508RequestListPage([default508RequestsQuery], testerStore);
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByTestId('accessibility-request-list-page')
    ).toBeInTheDocument();
  });

  it('shows the Add a new request button to a 508 tester', async () => {
    render508RequestListPage([default508RequestsQuery], testerStore);
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
    // console.log(wrapper.debug());
    expect(
      screen.getByRole('link', { name: /Add a new request/i })
    ).toBeInTheDocument();
  });

  it('does not show the Add a new request button to a 508 admin', async () => {
    render508RequestListPage([default508RequestsQuery], adminStore);
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
    expect(
      screen.queryByRole('link', { name: /A a new request/i })
    ).not.toBeInTheDocument();
  });
});
