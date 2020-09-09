import React from 'react';
import { shallow } from 'enzyme';

import PrepareForGRT from './index';

describe('The PrepareForGRT component', () => {
  it('renders without crashing', () => {
    shallow(<PrepareForGRT />);
  });
});
