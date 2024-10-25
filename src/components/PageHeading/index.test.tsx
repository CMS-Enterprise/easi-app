import React from 'react';
import { render } from '@testing-library/react';

import PageHeading from './index';

describe('Page heading component', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<PageHeading>Test Heading</PageHeading>);
    expect(asFragment()).toMatchSnapshot();
  });
});
