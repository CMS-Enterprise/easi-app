import React from 'react';
import { render } from '@testing-library/react';

import Label from './index';

describe('The Label component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <Label htmlFor="test" aria-label="aria test">
        <div data-testid="label-child">Hi</div>
      </Label>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
