import React from 'react';
import { render } from '@testing-library/react';
import { getMockSystemProfileData } from 'tests/mock/systemProfile';

import SystemDetails from './index';

const systemProfileData = getMockSystemProfileData();

describe('SystemDetails subpage for System Profile', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByText, getAllByText } = render(
      <SystemDetails system={systemProfileData} />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('https://cms.gov')).toBeInTheDocument();
    expect(getAllByText('Agile Methodology')[0]).toBeInTheDocument();
    // expect(screen.getByText('Code Repository')).toBeInTheDocument(); // n/a
  });
});
