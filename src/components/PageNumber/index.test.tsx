import React from 'react';
import { render } from '@testing-library/react';

import PageNumber from './index';

describe('The Page Number component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <PageNumber className="test-class-name" currentPage={2} totalPages={10} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
