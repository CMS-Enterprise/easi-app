import React from 'react';
import { render } from '@testing-library/react';

import PlainInfo from './index';

describe('Plain info component', () => {
  it('renders without errors', () => {
    render(<PlainInfo>The quick brown fox jumps over the lazy dog.</PlainInfo>);
  });
});
