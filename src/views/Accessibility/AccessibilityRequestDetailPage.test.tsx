import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import * as OktaReact from '@okta/okta-react';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ACCESSIBILITY_TESTER_DEV, BASIC_USER_PROD } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';
import CreateAccessibilityRequestNote from 'queries/CreateAccessibilityRequestNoteQuery';
import GetAccessibilityRequestAccessibilityTeamOnlyQuery from 'queries/GetAccessibilityRequestAccessibilityTeamOnlyQuery';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';

import AccessibilityRequestDetailPage from './AccessibilityRequestDetailPage';

beforeEach(() => {
  jest.resetModules();
});

jest.mock('@okta/okta-react');

function mockOkta(mockGroups: string[]) {
  OktaReact.useOktaAuth.mockReturnValue({
    authState: {
      isAuthenticated: true,
      accessToken: {
        claims: {
          groups: mockGroups,
          sub: 'AAAA'
        }
      },
      idToken: {
        claims: {
          name: 'A Person'
        }
      }
    },
    oktaAuth: {
      getUser: () =>
        Promise.resolve({
          name: 'John Doe'
        })
    }
  });
}

describe('AccessibilityRequestDetailPage', () => {
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
          testDates: [],
          statusRecord: {
            status: 'OPEN'
          }
        }
      }
    }
  };

  const render508DocumentsPage = (mocks: any[]) => {
    render(
      <MemoryRouter initialEntries={['/508/requests/a11yRequest123/documents']}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/508/requests/:accessibilityRequestId/documents">
            <MessageProvider>
              <AccessibilityRequestDetailPage />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('renders without crashing', async () => {
    mockOkta([BASIC_USER_PROD]);
    render508DocumentsPage([default508RequestQuery]);

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByTestId('accessibility-request-detail-page')
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
            testDates: [],
            statusRecord: {
              status: 'DELETED'
            }
          }
        }
      }
    };

    mockOkta([BASIC_USER_PROD]);
    render508DocumentsPage([deleted508RequestQuery]);

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /The request you are looking for was deleted./i
      })
    ).toBeInTheDocument();
  });

  describe('for a business owner', () => {
    // ✅ Documents
    const withDocsQuery = {
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
            submittedAt: new Date().toISOString(),
            name: 'MY Request',
            system: {
              name: 'TACO',
              lcid: '0000',
              businessOwner: { name: 'Clark Kent', component: 'OIT' }
            },
            documents: [
              {
                id: 'doc1',
                url: 'myurl',
                uploadedAt: 'time',
                status: 'PENDING',
                documentType: {
                  commonType: 'TEST_PLAN',
                  otherTypeDescription: ''
                }
              }
            ],
            testDates: [],
            statusRecord: {
              status: 'OPEN'
            },
            notes: [
              {
                id: 'noteID',
                authorName: 'Common Human',
                note: 'This is very well done'
              }
            ]
          }
        }
      }
    };

    // ❌ Documents
    const withoutDocsQuery = {
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
            submittedAt: new Date().toISOString(),
            name: 'MY Request',
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
    };

    it('renders Next step if no documents', async () => {
      mockOkta([BASIC_USER_PROD]);
      render508DocumentsPage([withoutDocsQuery]);

      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Next step/i
        })
      ).toBeInTheDocument();
    });

    it('renders the AccessibilityDocumentList when documents exist', async () => {
      mockOkta([BASIC_USER_PROD]);
      render508DocumentsPage([withDocsQuery]);

      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

      expect(screen.getByTestId('body-with-doc-table')).toBeInTheDocument();
    });
  });

  describe('for a 508 user or 508 tester', () => {
    const defaultQuery = {
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
            submittedAt: new Date().toISOString(),
            name: 'MY Request',
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
            notes: []
          }
        }
      }
    };

    // ✅ Notes
    // ❌ Documents
    const withNotesQuery = {
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
            submittedAt: new Date().toISOString(),
            name: 'MY Request',
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
                id: 'noteID',
                createdAt: new Date().toISOString(),
                authorName: 'Common Human',
                note: 'This is very well done'
              },
              {
                id: 'noteID2',
                createdAt: new Date().toISOString(),
                authorName: 'Common Human',
                note: 'This is okay'
              }
            ]
          }
        }
      }
    };

    // ✅ Documents
    // ❌ Notes
    const withDocsQuery = {
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
            name: 'MY Request',
            system: {
              name: 'TACO',
              lcid: '0000',
              businessOwner: { name: 'Clark Kent', component: 'OIT' }
            },
            documents: [
              {
                id: 'doc1',
                url: 'myurl',
                uploadedAt: 'time',
                status: 'PENDING',
                documentType: {
                  commonType: 'TEST_PLAN',
                  otherTypeDescription: ''
                }
              }
            ],
            testDates: [],
            statusRecord: {
              status: 'OPEN'
            },
            notes: [
              {
                id: 'noteID',
                createdAt: new Date().toISOString(),
                authorName: 'Common Human',
                note: 'This is very well done'
              }
            ]
          }
        }
      }
    };

    const render508NotesPage = (mocks: any[]) =>
      render(
        <MemoryRouter initialEntries={['/508/requests/a11yRequest123/notes']}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Route path="/508/requests/:accessibilityRequestId/notes">
              <MessageProvider>
                <AccessibilityRequestDetailPage />
              </MessageProvider>
            </Route>
          </MockedProvider>
        </MemoryRouter>
      );

    it("doesn't render table if there are no documents", async () => {
      mockOkta([BASIC_USER_PROD]);
      render508DocumentsPage([defaultQuery]);

      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

      expect(
        screen.queryByRole('table', { name: /Docuemnts uploaded/i })
      ).not.toBeInTheDocument();
    });

    it('renders table if there are documents', async () => {
      mockOkta([ACCESSIBILITY_TESTER_DEV]);
      render508DocumentsPage([withDocsQuery]);

      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

      expect(
        screen.getByRole('table', { name: /Documents upload/i })
      ).toBeInTheDocument();
    });

    it('can view existing notes', async () => {
      mockOkta([ACCESSIBILITY_TESTER_DEV]);
      render508NotesPage([withNotesQuery]);

      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

      const notesList = screen.getByRole('list', {
        name: /existing notes/i
      });

      expect(within(notesList).getAllByRole('listitem').length).toEqual(2);
    });

    describe('add note', () => {
      it('can add a note', async () => {
        const withNotesQueryWithNewNote = {
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
                submittedAt: new Date().toISOString(),
                name: 'MY Request',
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
                    id: 'noteID',
                    createdAt: new Date().toISOString(),
                    authorName: 'Common Human',
                    note: 'This is very well done'
                  },
                  {
                    id: 'noteID2',
                    createdAt: new Date().toISOString(),
                    authorName: 'Common Human',
                    note: 'This is okay'
                  },
                  {
                    id: 'noteID3',
                    createdAt: new Date().toISOString(),
                    authorName: 'Common Human',
                    note: 'This is quite a success'
                  }
                ]
              }
            }
          }
        };
        const createNoteMocks = [
          withNotesQuery,
          {
            request: {
              query: CreateAccessibilityRequestNote,
              variables: {
                input: {
                  requestID: 'a11yRequest123',
                  note: 'This is quite a success',
                  shouldSendEmail: false
                }
              }
            },
            result: {
              data: {
                createAccessibilityRequestNote: {
                  accessibilityRequestNote: {
                    id: 'noteID1',
                    createdAt: new Date().toISOString(),
                    authorName: 'Common Human',
                    note: 'This is quite a success',
                    requestID: 'a11yRequest123'
                  },
                  userErrors: null
                }
              }
            }
          },
          withNotesQueryWithNewNote
        ];

        mockOkta([ACCESSIBILITY_TESTER_DEV]);
        render508NotesPage(createNoteMocks);

        await waitForElementToBeRemoved(() =>
          screen.getByTestId('page-loading')
        );

        const textbox = screen.getByRole('textbox', { name: /note/i });
        userEvent.type(textbox, 'This is quite a success');
        screen.getByRole('button', { name: 'Add note' }).click();
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(within(alert).getByText(/success/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Note added to MY Request/i)
        ).toBeInTheDocument();

        const notesList = screen.getByRole('list', {
          name: /existing notes/i
        });
        await waitFor(() =>
          expect(within(notesList).getAllByRole('listitem')).toHaveLength(3)
        );
      });

      it('shows an error alert when there is a note form validation error', async () => {
        mockOkta([ACCESSIBILITY_TESTER_DEV]);
        render508NotesPage([defaultQuery]);

        await waitForElementToBeRemoved(() =>
          screen.getByTestId('page-loading')
        );

        screen.getByRole('button', { name: 'Add note' }).click();
        const alert = await screen.findByTestId('508-request-details-error');
        expect(alert).toBeInTheDocument();
        expect(
          within(alert).getByText(/There is a problem/i)
        ).toBeInTheDocument();
        expect(within(alert).getByRole('button', { name: /Enter a note/i }));
      });

      it('shows an error alert message for an internal server error', async () => {
        const errorMocks = [
          defaultQuery,
          {
            request: {
              query: CreateAccessibilityRequestNote,
              variables: {
                input: {
                  requestID: 'a11yRequest123',
                  note: 'I am an important note',
                  shouldSendEmail: false
                }
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

        mockOkta([ACCESSIBILITY_TESTER_DEV]);
        render508NotesPage(errorMocks);

        await waitForElementToBeRemoved(() =>
          screen.getByTestId('page-loading')
        );

        const textbox = screen.getByRole('textbox', { name: /note/i });
        userEvent.type(textbox, 'I am an important note');
        screen.getByRole('button', { name: 'Add note' }).click();
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(
          within(alert).getByText(/There is a problem/i)
        ).toBeInTheDocument();
        expect(
          within(alert).getByText(/Error saving note./i)
        ).toBeInTheDocument();
      });

      it('shows an error alert message for userErrors returned from the server', async () => {
        const userErrorMocks = [
          defaultQuery,
          {
            request: {
              query: CreateAccessibilityRequestNote,
              variables: {
                input: {
                  requestID: 'a11yRequest123',
                  note: 'I am an important note',
                  shouldSendEmail: false
                }
              }
            },
            result: {
              data: {
                createAccessibilityRequestNote: {
                  accessibilityRequestNote: null,
                  userErrors: [
                    {
                      message: 'I am a validation error',
                      path: ['createAccessibilityRequestNote']
                    }
                  ]
                }
              }
            }
          }
        ];

        mockOkta([ACCESSIBILITY_TESTER_DEV]);
        render508NotesPage(userErrorMocks);

        await waitForElementToBeRemoved(() =>
          screen.getByTestId('page-loading')
        );

        const textbox = screen.getByRole('textbox', { name: /note/i });
        userEvent.type(textbox, 'I am an important note');
        screen.getByRole('button', { name: 'Add note' }).click();
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(
          within(alert).getByText(/There is a problem/i)
        ).toBeInTheDocument();
        expect(
          within(alert).getByText(/I am a validation error/i)
        ).toBeInTheDocument();
      });
    });
  });
});
