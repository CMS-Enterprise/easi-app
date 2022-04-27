import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import StepsInvolved from './index';

describe('Section 508 Steps Involved', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <StepsInvolved />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
