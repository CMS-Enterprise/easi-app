import React from 'react';
import { render, screen } from '@testing-library/react';

import SystemProfileSectionCard from '.';

describe('SystemProfileSectionCard', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <SystemProfileSectionCard
        title="Section Title"
        description="This is the section card description."
        route="section-route"
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders partially managed externally', () => {
    render(
      <SystemProfileSectionCard
        title="Section Title"
        description="This is the section card description."
        route="section-route"
        isManagedExternally
      />
    );

    expect(
      screen.getByText('Data partially managed externally')
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Edit section' })).toHaveClass(
      'usa-button--outline'
    );
  });

  it('renders managed externally - read only view', () => {
    render(
      <SystemProfileSectionCard
        title="Section Title"
        description="This is the section card description."
        route="section-route"
        isManagedExternally
        readOnly
      />
    );

    expect(screen.getByText('Data managed externally')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View section' })).toHaveClass(
      'usa-button--outline'
    );
  });

  it('renders section with pending changes ', () => {
    render(
      <SystemProfileSectionCard
        title="Section Title"
        description="This is the section card description."
        route="section-route"
        hasPendingChanges
      />
    );

    expect(
      screen.getByText('This section has pending changes')
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View section' })).toHaveClass(
      'usa-button--unstyled'
    );
  });
});
