import React from 'react';
import { shallow } from 'enzyme';

import Footer from './index';

describe('The Footer component', () => {
  it('renders without crashing', () => {
    shallow(<Footer />);
  });
});
