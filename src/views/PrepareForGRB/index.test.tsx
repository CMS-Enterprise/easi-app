import React from 'react';
import { shallow } from 'enzyme';

import PrepareForGRB from './index';

describe('The PrepareForGRB component', () => {
  it('renders without crashing', () => {
    shallow(<PrepareForGRB />);
  });
});
