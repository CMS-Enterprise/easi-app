import React from 'react';
import { shallow } from 'enzyme';

import CharacterCounter from './index';

describe('The CharacterCounter component', () => {
  it('renders without crashing', () => {
    shallow(<CharacterCounter id="TestId" characterCount={1000} />);
  });
});
