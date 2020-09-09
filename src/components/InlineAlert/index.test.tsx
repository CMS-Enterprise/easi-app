import React from 'react';
import { shallow } from 'enzyme';

import InlineAlert from './index';

describe('The InlineAlert component', () => {
  it('renders without crashing', () => {
    shallow(<InlineAlert className="test-class">Please note!</InlineAlert>);
  });
});
