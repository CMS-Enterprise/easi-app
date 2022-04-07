import React from 'react';
import { render } from '@testing-library/react';

import NeedHelpBox from './index';

describe('Need help contact governance team', () => {
  it('renders without crashing', () => {
    const { asFragment } = render(<NeedHelpBox />);
    expect(asFragment()).toMatchSnapshot();
  });
});
