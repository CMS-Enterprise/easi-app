import React from 'react';
import { render } from '@testing-library/react';

import DataNotFound from '.';

describe('DataNotFound component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<DataNotFound />);
    expect(asFragment()).toMatchSnapshot();
  });
});
