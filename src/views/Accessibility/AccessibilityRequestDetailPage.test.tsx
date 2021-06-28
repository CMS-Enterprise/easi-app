import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount, shallow } from 'enzyme';
import GetAccessibilityRequestAccessibilityTeamOnlyQuery from 'queries/GetAccessibilityRequestAccessibilityTeamOnlyQuery';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';

import { ACCESSIBILITY_TESTER_DEV } from '../../constants/jobCodes';

import AccessibilityRequestDetailPage from './AccessibilityRequestDetailPage';

describe('AccessibilityRequestDetailPage', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'AAAA'
    }
  });

  const mocksWithoutDocs = [
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
    }
  ];
  it('renders without crashing', () => {
    const wrapper = shallow(
      <MemoryRouter>
        <MessageProvider>
          <AccessibilityRequestDetailPage />
        </MessageProvider>
      </MemoryRouter>
    );
    expect(wrapper.find('AccessibilityRequestDetailPage').length).toEqual(1);
  });

  describe('for a business owner', () => {
    it('renders Next step if no documents', async () => {
      let wrapper: any;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter initialEntries={['/508/requests/a11yRequest123']}>
            <MockedProvider mocks={mocksWithoutDocs} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/508/requests/:accessibilityRequestId">
                    <AccessibilityRequestDetailPage />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        wrapper.update();
      });
      expect(
        wrapper.find('h2').at(0).contains('Next step: Provide your documents')
      ).toBe(true);
    });

    it('renders the AccessibilityDocumentList when documents exist', async () => {
      const mocksWithDocs = [
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
                name: 'MY Request',
                system: {
                  name: 'TACO',
                  lcid: '0000',
                  businessOwner: { name: 'Clark Kent', component: 'OIT' }
                },
                documents: [
                  {
                    id: 'doc1',
                    url: 'https://host.biz/bucket/file.pdf',
                    uploadedAt: 'time',
                    status: 'PENDING',
                    documentType: {
                      commonType: 'TEST_PLAN',
                      otherTypeDescription: '',
                      __typename: 'AccessibilityRequestDocumentType'
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
        }
      ];

      let wrapper: any;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter initialEntries={['/508/requests/a11yRequest123']}>
            <MockedProvider mocks={mocksWithDocs} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/508/requests/:accessibilityRequestId">
                    <AccessibilityRequestDetailPage />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        wrapper.update();
      });
      expect(wrapper.find('h2').at(0).contains('Documents')).toBe(true);
      expect(wrapper.find('AccessibilityDocumentsList').exists()).toBe(true);
    });
  });

  describe('for a 508 user or 508 tester', () => {
    const testerStore = mockStore({
      auth: { groups: [ACCESSIBILITY_TESTER_DEV], isUserSet: true }
    });
    const mocksWithNotes = [
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
                  createdAt: 'time',
                  authorName: 'Common Human',
                  note: 'This is very well done'
                }
              ]
            }
          }
        }
      }
    ];

    it('renders "Documents" and no documents message if there are no documents', async () => {
      let wrapper: any;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter initialEntries={['/508/requests/a11yRequest123']}>
            <MockedProvider mocks={mocksWithNotes} addTypename={false}>
              <Provider store={testerStore}>
                <MessageProvider>
                  <Route path="/508/requests/:accessibilityRequestId">
                    <AccessibilityRequestDetailPage />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        wrapper.update();
      });
      expect(wrapper.find('h2').at(0).contains('Documents')).toBe(true);
      expect(wrapper.find('AccessibilityDocumentsList').exists()).toBe(true);
      expect(wrapper.find('AccessibilityDocumentsList').text()).toEqual(
        'No documents added to request yet.'
      );
    });
  });

  it('renders the accessibility request status', async () => {
    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/508/requests/a11yRequest123']}>
          <MockedProvider mocks={mocksWithoutDocs} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/508/requests/:accessibilityRequestId">
                  <AccessibilityRequestDetailPage />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      wrapper.update();
    });
    expect(
      wrapper
        .find('[data-testid="current-status-dt"]')
        .contains('Current status')
    ).toBe(true);
    expect(
      wrapper.find('[data-testid="current-status-dd"]').contains('Open')
    ).toBe(true);
  });
});
