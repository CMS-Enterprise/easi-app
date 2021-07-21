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
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';

import UpdateTestDate from './UpdateTestDate';

describe('UpdateTestDate page', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    }
  });

  const default508RequestQuery = {
    request: {
      query: GetAccessibilityRequestQuery,
      variables: {
        id: 'a11yRequest123'
      }
    },
    result: {
      data: {
        accessibilityRequest: {
          id: 'a11yRequest123',
          euaUserId: 'ABCD',
          submittedAt: new Date().toISOString(),
          name: 'My Special Request',
          system: {
            name: 'TACO',
            lcid: '123456',
            businessOwner: { name: 'Clark Kent', component: 'OIT' }
          },
          documents: [],
          testDates: [
            {
              id: 'td123',
              testType: 'INITIAL',
              date: new Date().toISOString(),
              score: null
            }
          ],
          statusRecord: {
            status: 'OPEN'
          }
        }
      }
    }
  };

  const buildProviders = (mocks: any, store: any) => (
    <MemoryRouter
      initialEntries={['/508/requests/a11yRequest123/test-date/td123']}
    >
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <Route path="/508/requests/:accessibilityRequestId/test-date/:testDateId">
            <MessageProvider>
              <UpdateTestDate />
            </MessageProvider>
          </Route>
        </Provider>
      </MockedProvider>
    </MemoryRouter>
  );

  it('renders without errors', async () => {
    render(buildProviders([default508RequestQuery], defaultStore));

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: 'Update a test date for My Special Request',
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders NotFound page if the test date id in the url is not found in the request', async () => {
    const requestQueryWithUnknownTestDateID = {
      request: {
        query: GetAccessibilityRequestQuery,
        variables: {
          id: 'a11yRequest123'
        }
      },
      result: {
        data: {
          accessibilityRequest: {
            id: 'a11yRequest123',
            euaUserId: 'ABCD',
            submittedAt: new Date().toISOString(),
            name: 'My Special Request',
            system: {
              name: 'TACO',
              lcid: '123456',
              businessOwner: { name: 'Clark Kent', component: 'OIT' }
            },
            documents: [],
            testDates: [
              {
                id: 'td987',
                testType: 'INITIAL',
                date: new Date().toISOString(),
                score: null
              }
            ],
            statusRecord: {
              status: 'OPEN'
            }
          }
        }
      }
    };

    render(buildProviders([requestQueryWithUnknownTestDateID], defaultStore));

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: 'This page cannot be found.',
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders RequestDeleted component when request is deleted', async () => {
    const deleted508RequestQuery = {
      request: {
        query: GetAccessibilityRequestQuery,
        variables: {
          id: 'a11yRequest123'
        }
      },
      result: {
        data: {
          accessibilityRequest: {
            id: 'a11yRequest123',
            euaUserId: 'ABCD',
            submittedAt: new Date().toISOString(),
            name: 'My Special Request',
            system: {
              name: 'TACO',
              lcid: '123456',
              businessOwner: { name: 'Clark Kent', component: 'OIT' }
            },
            documents: [],
            testDates: [
              {
                id: 'td123',
                testType: 'INITIAL',
                date: new Date().toISOString(),
                score: null
              }
            ],
            statusRecord: {
              status: 'DELETED'
            }
          }
        }
      }
    };

    render(buildProviders([deleted508RequestQuery], defaultStore));

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /The request you are looking for was deleted./i
      })
    ).toBeInTheDocument();
  });
});
