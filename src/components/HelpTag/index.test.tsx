import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import HelpTag from './index';

describe('HelpTag', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HelpTag type="IT Governance" />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
