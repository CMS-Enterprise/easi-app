import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import easiMockStore from 'utils/testing/easiMockStore';

import SystemProfileSectionCard from '.';

describe('SystemProfileSectionCard', () => {
  const store = easiMockStore();

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <SystemProfileSectionCard
          title="Section Title"
          description="This is the section card description."
          section={SystemProfileLockableSection.BUSINESS_INFORMATION}
        />
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders partially managed externally', () => {
    render(
      <Provider store={store}>
        <SystemProfileSectionCard
          title="Section Title"
          description="This is the section card description."
          section={SystemProfileLockableSection.BUSINESS_INFORMATION}
          isManagedExternally
        />
      </Provider>
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
      <Provider store={store}>
        <SystemProfileSectionCard
          title="Section Title"
          description="This is the section card description."
          section={SystemProfileLockableSection.BUSINESS_INFORMATION}
          isManagedExternally
          readOnly
        />
      </Provider>
    );

    expect(screen.getByText('Data managed externally')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View section' })).toHaveClass(
      'usa-button--outline'
    );
  });

  it('renders section with external data', () => {
    render(
      <Provider store={store}>
        <SystemProfileSectionCard
          title="Section Title"
          description="This is the section card description."
          section={SystemProfileLockableSection.BUSINESS_INFORMATION}
          externalDataExists
        />
      </Provider>
    );

    expect(screen.getByText('External data exists')).toBeInTheDocument();
  });

  it('renders section with pending changes ', () => {
    render(
      <Provider store={store}>
        <SystemProfileSectionCard
          title="Section Title"
          description="This is the section card description."
          section={SystemProfileLockableSection.BUSINESS_INFORMATION}
          hasPendingChanges
        />
      </Provider>
    );

    expect(
      screen.getByText('This section has pending changes')
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View section' })).toHaveClass(
      'usa-button--unstyled'
    );
  });
});
