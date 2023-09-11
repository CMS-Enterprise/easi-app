import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import Accessibility from './index';

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
            name: 'John Doe'
          })
      }
    };
  }
}));

describe('Accessibility wrapper', () => {
  const mockStore = configureMockStore();
  const store = mockStore({ auth: { groups: [], isUserSet: true } });

  it('renders without crashing', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <Accessibility />
      </Provider>
    );
    expect(wrapper.length).toBe(1);
  });
});
