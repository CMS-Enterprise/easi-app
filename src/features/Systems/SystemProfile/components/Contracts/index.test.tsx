import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { getMockSystemProfileData } from 'data/mock/systemProfile';

import Contracts from '.';

describe('System Contracts subpage', () => {
  const systemProfileData = getMockSystemProfileData();

  it('matches snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/contracts']}>
        <Contracts system={systemProfileData} />
      </MemoryRouter>
    );

    expect(
      getByText(
        'Centers for Medicare and Medicaid Services Analysis, Reporting and Tracking System (CMS ARTS)'
      )
    ).toBeInTheDocument();
    expect(getByText('75FCMC21F0028')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
