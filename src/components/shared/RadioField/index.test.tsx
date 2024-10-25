import React from 'react';
import { render } from '@testing-library/react';

import { RadioField } from './index';

describe('The Radio Field', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <RadioField
        id="TestRadio"
        label="A"
        name="Question1"
        onBlur={() => {}}
        onChange={() => {}}
        value="A"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
