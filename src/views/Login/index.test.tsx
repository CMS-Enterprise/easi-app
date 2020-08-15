import React from 'react';
import { shallow } from 'enzyme';

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
  it('renders without crashing', () => {
    shallow(<Login />);
  });

  it('renders the OktaSignInWidget', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find(OktaSignInWidget));
  });
});
