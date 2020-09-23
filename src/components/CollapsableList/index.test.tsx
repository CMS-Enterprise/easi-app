import React from 'react';
import { shallow } from 'enzyme';

import CollapsableList from './index';

describe('The CollapsableList component', () => {
  it('renders without crashing', () => {
    shallow(<CollapsableList label="test" items={['one']} />);
  });
});
