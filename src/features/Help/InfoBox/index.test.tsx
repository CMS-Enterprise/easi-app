import React from 'react';
import { render } from '@testing-library/react';

import NeedHelpBox from './NeedHelpBox';

describe('Help Info Box', () => {
  it('renders NeedHelpBox without crashing', () => {
    const { asFragment } = render(<NeedHelpBox />);
    expect(asFragment()).toMatchSnapshot();
  });
});
