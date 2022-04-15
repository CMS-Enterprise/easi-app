import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import ITGovernance from './index';

describe('IT Governance Help', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/help/it-governance']}>
        <ITGovernance />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
