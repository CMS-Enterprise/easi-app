import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount, shallow } from 'enzyme';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';

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
      wrapper.find('h2').at(1).contains('Next step: Provide your documents')
    ).toBe(true);
  });

  it('renders the AccessibilityDocumentList when documents exist', async () => {
    const mocks = [
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
                  url: 'myurl',
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
              }
            }
          }
        }
      }
    ];

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/508/requests/a11yRequest123']}>
          <MockedProvider mocks={mocks} addTypename={false}>
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
    expect(wrapper.find('h2').at(1).contains('Documents')).toBe(true);
    expect(wrapper.find('AccessibilityDocumentsList').exists()).toBe(true);
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
    expect(wrapper.find('h2').at(0).contains('Current status')).toBe(true);
    expect(wrapper.find('h2').at(0).find('span').contains('Open')).toBe(true);
  });
});
