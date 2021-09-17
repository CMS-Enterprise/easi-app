import React from 'react';
import { shallow } from 'enzyme';

import OktaSignInWidget from 'components/shared/OktaSignInWidget';

import Login from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      oktaAuth: {}
    };
  }
}));

describe('The Login page', () => {
  const renderLogin = () => shallow(<Login />);

  it('renders without crashing', () => {
    expect(renderLogin).not.toThrow();
  });

  it('renders the OktaSignInWidget', () => {
    const wrapper = renderLogin();
    expect(wrapper.find(OktaSignInWidget));
  });
});
