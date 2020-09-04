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
  it('renders without crashing', () => {
    const mockStore = configureMockStore();
    const store = mockStore({});
    shallow(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Provider store={store}>
          <Home />
        </Provider>
      </MemoryRouter>
    );
  });

  describe('User is logged in', () => {
    it('displays login button', async done => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntakes: {
          systemIntakes: []
        },
        businessCases: {
          businessCases: []
        },
        flags: {
          taskListLite: true
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
        systemIntakes: {
          systemIntakes: [
            {
              ...initialSystemIntakeForm,
              id: '1'
            },
            {
              ...initialSystemIntakeForm,
              id: '2',
              status: 'SUBMITTED'
            },
            {
              ...initialSystemIntakeForm,
              id: '3'
            },
            {
              ...initialSystemIntakeForm,
              id: '4',
              status: 'SUBMITTED',
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
        },
        flags: {
          taskListLite: true
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
