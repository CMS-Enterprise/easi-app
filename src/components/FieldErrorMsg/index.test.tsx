import React from 'react';
import { render } from '@testing-library/react';

import FieldErrorMsg from './index';

describe('The FieldErrorMsg componnet', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<FieldErrorMsg>Error</FieldErrorMsg>);
    expect(asFragment()).toMatchSnapshot();
  });
});
