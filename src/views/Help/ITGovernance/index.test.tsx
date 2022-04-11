import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import ITGovernance from './index';

describe('IT Governance Help', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/help/it-governance']}>
        <Route path="/help/it-governance">
          <ITGovernance />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
