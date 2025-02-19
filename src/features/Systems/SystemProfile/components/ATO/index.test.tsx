import React from 'react';
import { render } from '@testing-library/react';
import { getMockSystemProfileData } from 'tests/mock/systemProfile';

import ATO from './index';

const systemProfileData = getMockSystemProfileData();

describe('ATO subpage for System Profile', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(<ATO system={systemProfileData} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a green card and expiration logic help text for Active', () => {
    const { getByTestId } = render(
      <ATO system={{ ...systemProfileData, atoStatus: 'Active' }} />
    );
    expect(getByTestId('Card')).toHaveClass('bg-success-dark');
    expect(getByTestId('atoExpirationLogicHelpText')).toBeInTheDocument();
  });

  it('renders a red card and expiration logic help text for Expired', () => {
    const { getByTestId } = render(
      <ATO system={{ ...systemProfileData, atoStatus: 'Expired' }} />
    );
    expect(getByTestId('Card')).toHaveClass('bg-error-dark');
    expect(getByTestId('atoExpirationLogicHelpText')).toBeInTheDocument();
  });

  it('renders a grey card and alert for No ATO', () => {
    const { getByTestId } = render(
      <ATO system={{ ...systemProfileData, atoStatus: 'No ATO' }} />
    );
    expect(getByTestId('Card')).toHaveClass('bg-base-lighter');
    expect(getByTestId('noATOAlert')).toBeInTheDocument();
  });
});
