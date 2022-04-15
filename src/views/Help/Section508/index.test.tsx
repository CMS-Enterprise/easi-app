import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import Section508 from './index';

describe('Setion 508 Help Center', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/help/section-508']}>
        <Section508 />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
