import React from 'react';
import { render } from '@testing-library/react';

import HelpBreadcrumb from './index';

describe('HelpBreadcrumb', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<HelpBreadcrumb />);
    expect(asFragment()).toMatchSnapshot();
  });
});
