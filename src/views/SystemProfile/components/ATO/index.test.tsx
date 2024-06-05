import React from 'react';
import { render } from '@testing-library/react';

import { getMockSystemProfileData } from 'data/mock/systemProfile';

import ATO from './index';

const systemProfileData = getMockSystemProfileData();

describe('ATO subpage for System Profile', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(<ATO system={systemProfileData} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a green card for Active', () => {
    const { getByTestId } = render(
      <ATO system={{ ...systemProfileData, atoStatus: 'Active' }} />
    );
    expect(getByTestId('Card')).toHaveClass('bg-success-dark');
  });

  it('renders a red card for Expired', () => {
    const { getByTestId } = render(
      <ATO system={{ ...systemProfileData, atoStatus: 'Expired' }} />
    );
    expect(getByTestId('Card')).toHaveClass('bg-error-dark');
  });

  it('renders a grey card for No ATO', () => {
    const { getByTestId } = render(
      <ATO system={{ ...systemProfileData, atoStatus: 'No ATO' }} />
    );
    expect(getByTestId('Card')).toHaveClass('bg-base-lighter');
  });
});
