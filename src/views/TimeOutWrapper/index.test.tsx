import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { updateSessionExpiration } from 'reducers/authReducer';

import TimeOutWrapper from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      authService: {
        getUser: async () => ({
          name: 'John Doe'
        }),
        logout: async () => {},
        _oktaAuth: {
          session: {
            get: async () => ({
              expiresAt: new Date().getTime() + 4 * 60 * 1000
            })
          }
        }
      }
    };
  }
}));

describe('The TimeOutWrapper component', () => {
  it('renders without crashing', () => {
    const mockStore = configureMockStore();
    const store = mockStore({});

    shallow(
      <Provider store={store}>
        <TimeOutWrapper>
          <div />
        </TimeOutWrapper>
      </Provider>
    );
  });

  it('displays a modal', async done => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        lastActiveAt: new Date().getTime(),
        lastSessionRenew: 0,
        sessionExpiration: 0
      }
    });
    const mockExpiration = new Date().getTime() + 4 * 60 * 1000;
    const component = mount(
      <Provider store={store}>
        <TimeOutWrapper>
          <div />
        </TimeOutWrapper>
      </Provider>
    );
    store.dispatch(updateSessionExpiration(mockExpiration));
    component.update();
    console.log(store.getState());
    console.log(component.debug());
  });
});
