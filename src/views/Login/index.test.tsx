import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import OktaSignInWidget from 'components/shared/OktaSignInWidget';

import Login from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authService: {}
    };
  }
}));

describe('The Login page', () => {
  const mockStore = configureMockStore();
  const store = mockStore();

  const renderLogin = () =>
    shallow(
      <Provider store={store}>
        <Login />
      </Provider>
    );

  it('renders without crashing', () => {
    expect(renderLogin).not.toThrow();
  });

  it('renders the OktaSignInWidget', () => {
    const wrapper = renderLogin();
    expect(wrapper.find(OktaSignInWidget));
  });
});
