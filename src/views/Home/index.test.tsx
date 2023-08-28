import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { mockFlags, resetLDMocks } from 'jest-launchdarkly-mock';
import configureMockStore from 'redux-mock-store';

import {
  getRequestsQuery,
  getTrbAdminTeamHomeQuery
} from 'data/mock/trbRequest';
import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import { Flags } from 'types/flags';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';
import Table from 'views/MyRequests/Table';

import AdminHome from './AdminHome';
import Home from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'Jerry Seinfeld'
          })
      }
    };
  }
}));

const defaultFlags: Flags = {
  downgrade508Tester: false,
  downgrade508User: false,
  downgradeGovTeam: false,
  downgradeTrbAdmin: false,
  sandbox: true
} as Flags;

const mocks = [
  getRequestsQuery([], []),
  {
    request: {
      query: GetCedarSystemsQuery
    },
    result: {
      data: {
        cedarSystems: []
      }
    }
  },
  {
    request: {
      query: GetCedarSystemBookmarksQuery
    },
    result: {
      data: {
        cedarSystemBookmarks: []
      }
    }
  }
];

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
      it('displays process options', async () => {
        mockFlags({ ...defaultFlags });
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
            component.find('h3[children="IT Governance"]').exists()
          ).toEqual(true);

          expect(component.find('h3[children="Section 508"]').exists()).toEqual(
            true
          );

          expect(component.find('hr').exists()).toBeTruthy();

          expect(component.find(Table).exists()).toBeTruthy();
        });
      });
    });
  });

  describe('is a grt reviewer', () => {
    const mockAuthReducer = {
      isUserSet: true,
      groups: ['EASI_D_GOVTEAM']
    };

    const mountComponent = (mockedStore: any): ReactWrapper => {
      const mockStore = configureMockStore();
      const store = mockStore(mockedStore);
      return mount(
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
  });

  describe('Admin home view', () => {
    it('renders the select admin view dropdown', async () => {
      window.localStorage.clear();
      const mockStore = configureMockStore();
      const store = mockStore({
        auth: {
          isUserSet: true,
          groups: ['EASI_D_GOVTEAM']
        },
        systemIntakes: mockOpenIntakes
      });

      const { getByTestId, getByRole, findByRole } = render(
        <MemoryRouter>
          <Provider store={store}>
            <VerboseMockedProvider mocks={[...mocks, getTrbAdminTeamHomeQuery]}>
              <MessageProvider>
                <AdminHome isGrtReviewer isTrbAdmin />
              </MessageProvider>
            </VerboseMockedProvider>
          </Provider>
        </MemoryRouter>
      );

      // check that select field defaults to TRB
      const selectField = getByTestId('select-admin-view');
      expect(selectField).toHaveValue('TRB');
      expect(
        getByRole('heading', { name: 'Technical assistance requests' })
      ).toBeInTheDocument();

      // Switch to GRT view
      userEvent.selectOptions(selectField, ['GRT']);
      await findByRole('heading', { name: 'IT Governance requests' });
    });
  });
});
