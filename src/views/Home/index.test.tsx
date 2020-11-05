import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import ActionBanner from 'components/shared/ActionBanner';
import { businessCaseInitialData } from 'data/businessCase';
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
      userGroupsSet: true,
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
      it('displays login button', async done => {
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
                <Home />
              </Provider>
            </MemoryRouter>
          );

          setImmediate(() => {
            component.update();

            expect(component.find('a[children="Start now"]').exists()).toEqual(
              true
            );
            done();
          });
        });
      });

      it('displays banners for intakes and biz cases', async done => {
        const mockStore = configureMockStore();
        const store = mockStore({
          auth: mockAuthReducer,
          systemIntakes: {
            systemIntakes: [
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
            ]
          },
          businessCases: {
            businessCases: [
              {
                ...businessCaseInitialData,
                id: '1',
                systemIntakeId: '4'
              }
            ]
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

          setImmediate(() => {
            component.update();
            expect(component.find(ActionBanner).length).toEqual(4);
            done();
          });
        });
      });
    });
  });

  describe('is a grt reviewer', () => {
    const mockAuthReducer = {
      userGroupsSet: true,
      groups: ['EASI_D_GOVTEAM']
    };

    const mockSystemIntakes = {
      systemIntakes: [
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
      ]
    };

    const mountComponent = () => {
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

    it('renders the table', async done => {
      let homePage: any;
      await act(async () => {
        homePage = mountComponent();

        setImmediate(() => {
          homePage.update();
          expect(homePage.text()).toContain('There are 4 requests');
          done();
        });
      });
    });

    it('does not render any banners', async done => {
      let homePage: any;
      await act(async () => {
        homePage = mountComponent();

        setImmediate(() => {
          homePage.update();
          expect(homePage.find(ActionBanner).length).toEqual(0);
          done();
        });
      });
    });
  });
});
