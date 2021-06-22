import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';

import { ACCESSIBILITY_TESTER_DEV } from '../../constants/jobCodes';
import GetAccessibilityRequestAccessibilityTeamOnlyQuery from '../../queries/GetAccessibilityRequestAccessibilityTeamOnlyQuery';

import AccessibilityRequestDetailPage from './AccessibilityRequestDetailPage';

describe('AccessibilityRequestDetailPage', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    }
  });

  const defaultMocks = [
    {
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
            euaUserId: 'AAAA',
            submittedAt: new Date(),
            name: 'My Special Request',
            system: {
              name: 'TACO',
              lcid: '0000',
              businessOwner: { name: 'Clark Kent', component: 'OIT' }
            },
            documents: [],
            testDates: [],
            statusRecord: {
              status: 'OPEN'
            }
          }
        }
      }
    }
  ];

  const buildProviders = (
    mocks: any,
    store: any,
    children: React.ReactElement
  ) => (
    <MemoryRouter initialEntries={['/508/requests/a11yRequest123']}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <Route path="/508/requests/:accessibilityRequestId">
            <MessageProvider>{children}</MessageProvider>
          </Route>
        </Provider>
      </MockedProvider>
    </MemoryRouter>
  );
  it('renders without errors', async () => {
    const providers = buildProviders(
      defaultMocks,
      defaultStore,
      <AccessibilityRequestDetailPage />
    );
    render(providers);
    expect(
      await screen.findByRole('heading', {
        name: 'My Special Request current status Open',
        level: 1
      })
    ).toBeInTheDocument();
  });

  describe('notes tab', () => {
    const testerMocks = [
      {
        request: {
          query: GetAccessibilityRequestAccessibilityTeamOnlyQuery,
          variables: {
            id: 'a11yRequest123'
          }
        },
        result: {
          data: {
            accessibilityRequest: {
              id: 'a11yRequest123',
              euaUserId: 'AAAA',
              submittedAt: new Date(),
              name: 'My Special Request',
              system: {
                name: 'TACO',
                lcid: '0000',
                businessOwner: { name: 'Clark Kent', component: 'OIT' }
              },
              documents: [],
              testDates: [],
              statusRecord: {
                status: 'OPEN'
              },
              notes: [
                {
                  id: 'noteID1',
                  createdAt: 'time',
                  authorName: 'Common Human',
                  note: 'This is very well done'
                },
                {
                  id: 'noteID2',
                  createdAt: 'time',
                  authorName: 'Common Human',
                  note: 'This is okay'
                }
              ]
            }
          }
        }
      }
    ];
    const testerStore = mockStore({
      auth: {
        euaId: 'AAAB',
        groups: [ACCESSIBILITY_TESTER_DEV],
        isUserSet: true
      }
    });

    it('can view existing notes', async () => {
      const providers = buildProviders(
        testerMocks,
        testerStore,
        <AccessibilityRequestDetailPage />
      );

      render(providers);

      expect(
        await screen.findByRole('tab', {
          name: 'Notes'
        })
      ).toBeInTheDocument();

      const notesTab = screen.getByRole('tab', { name: 'Notes' });
      userEvent.click(notesTab);
      expect(
        await screen.findByRole('heading', {
          name: '2 existing notes',
          level: 3
        })
      ).toBeInTheDocument();
    });
  });
});
