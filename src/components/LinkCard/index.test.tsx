import React from 'react';
import { shallow } from 'enzyme';

import LinkCard from './index';

describe('LinkCard', () => {
  it('renders without crashing', () => {
    shallow(<LinkCard />);
  });
});
