import React from 'react';
import { shallow } from 'enzyme';

import PlainInfo from './index';

describe('Plain info component', () => {
  it('renders without errors', () => {
    shallow(
      <PlainInfo>The quick brown fox jumps over the lazy dog.</PlainInfo>
    );
  });
});
