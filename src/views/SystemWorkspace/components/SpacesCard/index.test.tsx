import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import UswdsReactLink from 'components/LinkWrapper';

import SpacesCard from '.';

describe('SpacesCard component', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <SpacesCard
          header="My space"
          description="It is very large"
          footer={<UswdsReactLink to="/systems">A link</UswdsReactLink>}
        />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
