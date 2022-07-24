import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { getMockSystemProfileData } from 'data/mock/systemProfile';

import SubSystems from './index';

describe('System Sub-systems subpage', () => {
  const systemProfileData = getMockSystemProfileData();

  it('matches snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/sub-systems']}>
        <SubSystems system={systemProfileData} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('Test Ocular Fiction Utensil')).toBeInTheDocument();
    expect(getByText('Planned retirement: Q4 2022')).toBeInTheDocument();
  });
});
