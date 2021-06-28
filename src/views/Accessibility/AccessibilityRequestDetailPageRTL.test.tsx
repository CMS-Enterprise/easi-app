import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAccessibilityRequestNote from 'queries/CreateAccessibilityRequestNoteQuery';
import GetAccessibilityRequestAccessibilityTeamOnlyQuery from 'queries/GetAccessibilityRequestAccessibilityTeamOnlyQuery';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import configureMockStore from 'redux-mock-store';

import { ACCESSIBILITY_TESTER_DEV } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';

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

      const { findByRole, getAllByRole, getByRole } = render(providers);
      expect(
        await findByRole('tab', {
          name: 'Notes'
        })
      ).toBeInTheDocument();

      const notesTab = getByRole('tab', { name: 'Notes' });
      userEvent.click(notesTab);
      expect(
        await findByRole('heading', {
          name: '2 existing notes',
          level: 3
        })
      ).toBeInTheDocument();

      const [, notesList] = getAllByRole('list');
      expect(within(notesList).getAllByRole('listitem').length).toEqual(2);
    });

    describe('Add a note', () => {
      it('shows a success message', async () => {
        const createNoteMocks = [
          testerMocks[0],
          {
            request: {
              query: CreateAccessibilityRequestNote,
              variables: {
                requestID: 'a11yRequest123',
                note: 'I am an important note',
                shouldSendEmail: false
              }
            },
            result: {
              data: {
                createAccessibilityRequestNote: {
                  id: 'noteID2',
                  createdAt: 'time',
                  authorName: 'Common Human',
                  note: 'This is such a success'
                }
              }
            }
          }
        ];

        const providers = buildProviders(
          createNoteMocks,
          testerStore,
          <AccessibilityRequestDetailPage />
        );
        const { findByRole, getByRole } = render(providers);
        expect(await findByRole('alert')).toBeInTheDocument();
        const { getByText } = within(getByRole('alert'));
        expect(await getByText('Success')).toBeInTheDocument();
        expect(
          await getByText('Note added to My Special Request')
        ).toBeInTheDocument();
      });

      it('can navigate through note tab', async () => {
        const providers = buildProviders(
          testerMocks,
          testerStore,
          <AccessibilityRequestDetailPage />
        );

        const { getByRole, getByTestId } = render(providers);
        const notesTab = getByTestId('Notes-tab');
        const notesTabButton = getByTestId('Notes-tab-btn');
        userEvent.click(notesTabButton);
        expect(await notesTab).toHaveClass('easi-tabs__tab--selected');
        expect(await notesTabButton).toHaveFocus();
        userEvent.tab();
        expect(getByTestId('Notes-panel')).toHaveFocus();
        userEvent.tab();
        expect(
          await getByRole('button', { name: 'Skip to existing notes' })
        ).toHaveFocus();
        userEvent.tab();
        const textBox = getByRole('textbox', { name: 'Note' });
        expect(await textBox).toHaveFocus();
        userEvent.type(textBox, 'This request has been tested');
        userEvent.tab();
        expect(await getByRole('checkbox')).toHaveFocus();
        userEvent.tab();
      });

      it('shows an error alert when there is a validation error', async () => {
        const providers = buildProviders(
          testerMocks,
          testerStore,
          <AccessibilityRequestDetailPage />
        );

        const { getByRole } = render(providers);

        getByRole('button', { name: 'Add note' }).click();
        expect(await getByRole('alert')).toBeInTheDocument();
      });

      it('shows an error alert message for an internal server error', async () => {
        const errorMocks = [
          testerMocks[0],
          {
            request: {
              query: CreateAccessibilityRequestNote,
              variables: {
                requestID: 'a11yRequest123',
                note: 'I am an important note',
                shouldSendEmail: false
              }
            },
            result: {
              errors: [
                {
                  message: 'Something went very wrong',
                  path: ['createAccessibilityRequestNote']
                }
              ],
              data: { createAccessibilityRequestNote: null }
            }
          }
        ];

        const providers = buildProviders(
          errorMocks,
          testerStore,
          <AccessibilityRequestDetailPage />
        );
        const { findByRole, getByRole } = render(providers);
        expect(await findByRole('alert')).toBeInTheDocument();
        const { getByText } = within(getByRole('alert'));
        expect(await getByText('There is a problem')).toBeInTheDocument();
      });

      it('shows an error message for userErrors returned from the server', async () => {
        const errorMocks = [
          testerMocks[0],
          {
            request: {
              query: CreateAccessibilityRequestNote,
              variables: {
                requestID: 'a11yRequest123',
                note: 'I am an important note',
                shouldSendEmail: false
              }
            },
            result: {
              data: {
                createAccessibilityRequestNote: {
                  accessibilityRequestNote: null,
                  userErrors: [
                    {
                      message: 'I am a validation error',
                      path: ['createAccessibilityRequest']
                    }
                  ]
                }
              }
            }
          }
        ];

        const providers = buildProviders(
          errorMocks,
          testerStore,
          <AccessibilityRequestDetailPage />
        );
        const { findByRole, getByRole } = render(providers);
        expect(await findByRole('alert')).toBeInTheDocument();
        const { getByText } = within(getByRole('alert'));
        expect(await getByText('There is a problem')).toBeInTheDocument();
      });
    });
  });
});
