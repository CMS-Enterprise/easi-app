import React from 'react';
import { render } from '@testing-library/react';

import HelpText from './index';

describe('The Help Text component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<HelpText>Hello!</HelpText>);
    expect(asFragment()).toMatchSnapshot();
  });
});
