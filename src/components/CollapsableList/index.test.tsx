import React from 'react';
import { render } from '@testing-library/react';

import CollapsableList from './index';

describe('The CollapsableList component', () => {
  it('renders without crashing', () => {
    render(<CollapsableList label="test" items={['one']} />);
  });
});
