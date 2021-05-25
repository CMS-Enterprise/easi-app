import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { mockFlags, resetLDMocks } from 'jest-launchdarkly-mock';
import GetRequestsQuery from 'queries/GetRequestsQuery';
import configureMockStore from 'redux-mock-store';

import ActionBanner from 'components/shared/ActionBanner';
import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import Table from 'views/MyRequests/Table';

import Home from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

const defaultFlags = {
  add508Request: false,
  downgrade508Tester: false,
  downgrade508User: false,
  downgradeGovTeam: false,
  fileUploads: true,
  pdfExport: true,
  prototype508: true,
  prototypeTrb: true,
  sandbox: true
};

describe('The home page', () => {
  beforeEach(() => {
    resetLDMocks();
  });
  describe('not a grt review user', () => {
    const mockAuthReducer = {
      isUserSet: true,
      groups: []
    };

    it('renders without crashing', () => {
      const mockStore = configureMockStore();
      const store = mockStore({ auth: mockAuthReducer });
      const renderComponent = () =>
        shallow(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <Home />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      expect(renderComponent).not.toThrow();
    });

    describe('User is logged in', () => {
      describe('add508FeatureFlag is false', () => {
        it('displays login button', async () => {
          mockFlags(defaultFlags);
          const mockStore = configureMockStore();
          const store = mockStore({
            auth: mockAuthReducer,
            systemIntakes: {
              systemIntakes: []
            },
            businessCases: {
              businessCases: []
            }
          });
          let component: any;
          await act(async () => {
            component = mount(
              <MemoryRouter initialEntries={['/']} initialIndex={0}>
                <Provider store={store}>
                  <MessageProvider>
                    <Home />
                  </MessageProvider>
                </Provider>
              </MemoryRouter>
            );
            component.update();
            expect(component.find('a[children="Start now"]').exists()).toEqual(
              true
            );
          });
        });
      });
      describe('add508FeatureFlag is true', () => {
        it('displays process options', async () => {
          mockFlags({ ...defaultFlags, add508Request: true });
          const mockStore = configureMockStore();
          const store = mockStore({
            auth: mockAuthReducer,
            systemIntakes: {
              systemIntakes: []
            },
            businessCases: {
              businessCases: []
            }
          });
          let component: any;
          const mocks = [
            {
              request: {
                query: GetRequestsQuery,
                variables: { first: 20 }
              },
              result: {}
            }
          ];
          await act(async () => {
            component = mount(
              <MemoryRouter initialEntries={['/']} initialIndex={0}>
                <MockedProvider mocks={mocks}>
                  <Provider store={store}>
                    <MessageProvider>
                      <Home />
                    </MessageProvider>
                  </Provider>
                </MockedProvider>
              </MemoryRouter>
            );
            component.update();
            expect(component.find('a[children="Start now"]').exists()).toEqual(
              false
            );
            expect(
              component.find('a[children="IT Governance"]').exists()
            ).toEqual(true);
            expect(
              component.find('a[children="Section 508 compliance"]').exists()
            ).toEqual(true);
            expect(component.find('hr').exists()).toBeTruthy();
            expect(component.find(Table).exists()).toBeTruthy();
          });
        });
      });
    });
  });

  describe('is a grt reviewer', () => {
    const mockAuthReducer = {
      isUserSet: true,
      groups: ['EASI_D_GOVTEAM']
    };

    const mockOpenIntakes = [
      {
        ...initialSystemIntakeForm,
        id: '2',
        status: 'INTAKE_SUBMITTED'
      },
      {
        ...initialSystemIntakeForm,
        id: '4',
        status: 'INTAKE_SUBMITTED',
        businessCaseId: '1'
      }
    ];

    const mockClosedIntakes = [
      {
        ...initialSystemIntakeForm,
        id: '4',
        status: 'WITHDRAWN'
      }
    ];

    const mountComponent = (mockedStore: any): ReactWrapper => {
      const mockStore = configureMockStore();
      const store = mockStore(mockedStore);
      return mount(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Provider store={store}>
            <MessageProvider>
              <Home />
            </MessageProvider>
          </Provider>
        </MemoryRouter>
      );
    };

    it('renders without crashing', () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        auth: mockAuthReducer,
        systemIntakes: mockOpenIntakes
      });
      const shallowComponent = () =>
        shallow(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <Home />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      expect(shallowComponent).not.toThrow();
    });

    it('renders the open requests table', async () => {
      mockFlags(defaultFlags);
      const homePage = mountComponent({
        auth: mockAuthReducer,
        systemIntakes: {
          systemIntakes: mockOpenIntakes
        },
        businessCases: {
          businessCases: []
        }
      });

      await act(async () => {
        homePage.update();
        expect(homePage.text()).toContain('There are 2 open requests');
      });
    });

    it('renders the closed requests table', async () => {
      mockFlags(defaultFlags);
      const homePage = mountComponent({
        auth: mockAuthReducer,
        systemIntakes: {
          systemIntakes: mockClosedIntakes
        },
        businessCases: {
          businessCases: []
        }
      });

      homePage
        .find('[data-testid="view-closed-intakes-btn"]')
        .simulate('click');
      await act(async () => {
        homePage.update();
        expect(homePage.text()).toContain('There is 1 closed request');
      });
    });

    it('does not render any banners', async () => {
      mockFlags(defaultFlags);
      const homePage = mountComponent({
        auth: mockAuthReducer,
        systemIntakes: {
          systemIntakes: mockOpenIntakes
        },
        businessCases: {
          businessCases: []
        }
      });

      await act(async () => {
        homePage.update();
        expect(homePage.find(ActionBanner).length).toEqual(0);
      });
    });
  });
});
