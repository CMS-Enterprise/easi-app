import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount, ReactWrapper, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import ActionBanner from 'components/shared/ActionBanner';
import { initialSystemIntakeForm } from 'data/systemIntake';

import Home from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      authService: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

describe('The home page', () => {
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
              <Home />
            </Provider>
          </MemoryRouter>
        );
      expect(renderComponent).not.toThrow();
    });

    describe('User is logged in', () => {
      it('displays login button', async () => {
        const mockStore = configureMockStore();
        const store = mockStore({
          auth: mockAuthReducer,
          systemIntakes: {
            openIntakes: [],
            closedIntakes: []
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
                <Home />
              </Provider>
            </MemoryRouter>
          );

          component.update();

          expect(component.find('a[children="Start now"]').exists()).toEqual(
            true
          );
        });
      });

      it('displays banners for intakes', async () => {
        const mockStore = configureMockStore();
        const store = mockStore({
          auth: mockAuthReducer,
          systemIntakes: {
            openIntakes: [
              {
                ...initialSystemIntakeForm,
                id: '1'
              },
              {
                ...initialSystemIntakeForm,
                id: '2',
                status: 'NEED_BIZ_CASE'
              },
              {
                ...initialSystemIntakeForm,
                id: '3'
              },
              {
                ...initialSystemIntakeForm,
                id: '4',
                status: 'NEED_BIZ_CASE',
                businessCaseId: '1'
              }
            ],
            closeIntakes: []
          }
        });
        let component: any;

        await act(async () => {
          component = mount(
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
              <Provider store={store}>
                <Home />
              </Provider>
            </MemoryRouter>
          );

          component.update();
          expect(component.find(ActionBanner).length).toEqual(4);
        });
      });
    });
  });

  describe('is a grt reviewer', () => {
    const mockAuthReducer = {
      isUserSet: true,
      groups: ['EASI_D_GOVTEAM']
    };

    const mockSystemIntakes = {
      openIntakes: [
        {
          ...initialSystemIntakeForm,
          id: '1'
        },
        {
          ...initialSystemIntakeForm,
          id: '2',
          status: 'INTAKE_SUBMITTED'
        },
        {
          ...initialSystemIntakeForm,
          id: '3'
        },
        {
          ...initialSystemIntakeForm,
          id: '4',
          status: 'INTAKE_SUBMITTED',
          businessCaseId: '1'
        }
      ],
      closedIntakes: [
        {
          ...initialSystemIntakeForm,
          id: '4',
          status: 'WITHDRAWN'
        }
      ]
    };

    const mountComponent = (): ReactWrapper => {
      const mockStore = configureMockStore();
      const store = mockStore({
        auth: mockAuthReducer,
        systemIntakes: mockSystemIntakes,
        businessCases: {
          businessCases: []
        }
      });
      return mount(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Provider store={store}>
            <Home />
          </Provider>
        </MemoryRouter>
      );
    };

    it('renders without crashing', () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        auth: mockAuthReducer,
        systemIntakes: mockSystemIntakes
      });
      const shallowComponent = () =>
        shallow(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <Home />
            </Provider>
          </MemoryRouter>
        );
      expect(shallowComponent).not.toThrow();
    });

    it('renders the open requests table', async () => {
      const homePage = mountComponent();

      await act(async () => {
        homePage.update();
        expect(homePage.text()).toContain('There are 4 open requests');
      });
    });

    it('renders the closed requests table', async () => {
      const homePage = mountComponent();

      homePage
        .find('[data-testid="view-closed-intakes-btn"]')
        .simulate('click');
      await act(async () => {
        homePage.update();
        expect(homePage.text()).toContain('There is 1 closed request');
      });
    });

    it('does not render any banners', async () => {
      const homePage = mountComponent();

      await act(async () => {
        homePage.update();
        expect(homePage.find(ActionBanner).length).toEqual(0);
      });
    });
  });
});
