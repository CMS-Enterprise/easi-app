import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import HelpContacts from './index';

describe('HelpContacts', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HelpContacts type="IT Governance" />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correct contacts when array is passed', () => {
    const { getByText } = render(
      <MemoryRouter>
        <HelpContacts type={['IT Governance']} />
      </MemoryRouter>
    );

    expect(getByText('Governance Review Admin')).toBeInTheDocument();
  });
});
