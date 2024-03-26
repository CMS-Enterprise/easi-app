import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { getMockSystemProfileData } from 'data/mock/systemProfile';

import Contracts from '.';

describe('System Contracts subpage', () => {
  const systemProfileData = getMockSystemProfileData();

  it('matches snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/sub-systems']}>
        <Contracts system={systemProfileData} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('Test Ocular Fiction Utensil')).toBeInTheDocument();
    expect(getByText('Planned retirement: Q4 2022')).toBeInTheDocument();
  });
});
