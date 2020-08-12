import React from 'react';
import { shallow } from 'enzyme';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
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
