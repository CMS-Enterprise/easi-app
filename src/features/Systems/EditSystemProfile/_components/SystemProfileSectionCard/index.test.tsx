import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';
import i18next from 'i18next';

import easiMockStore from 'utils/testing/easiMockStore';

import SystemProfileSectionCard from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

describe('SystemProfileSectionCard', () => {
  const store = easiMockStore();

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
          <Route path="/systems/:systemId/edit">
            <SystemProfileSectionCard
              section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
            />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders section title and description', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
          <Route path="/systems/:systemId/edit">
            <SystemProfileSectionCard
              section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
            />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText(
        i18next.t<string>(
          'systemProfile:sectionCards.IMPLEMENTATION_DETAILS.title'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>(
          'systemProfile:sectionCards.IMPLEMENTATION_DETAILS.description'
        )
      )
    ).toBeInTheDocument();
  });

  it('renders partially managed externally', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
          <Route path="/systems/:systemId/edit">
            <SystemProfileSectionCard
              section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
              isManagedExternally
            />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText('Data partially managed externally')
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Edit section' })).toHaveClass(
      'usa-button--outline'
    );
  });

  it('renders managed externally - read only view', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
          <Route path="/systems/:systemId/edit">
            <SystemProfileSectionCard
              section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
              isManagedExternally
              readOnly
            />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Data managed externally')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'View section' })).toHaveClass(
      'usa-button--outline'
    );
  });

  it('renders section with external data', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
          <Route path="/systems/:systemId/edit">
            <SystemProfileSectionCard
              section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
              hasExternalData
            />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('External data exists')).toBeInTheDocument();
  });

  it('renders section with pending changes ', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
          <Route path="/systems/:systemId/edit">
            <SystemProfileSectionCard
              section={SystemProfileLockableSection.IMPLEMENTATION_DETAILS}
              hasPendingChanges
            />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText('This section has pending changes')
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'View section' })).toHaveClass(
      'usa-button--unstyled'
    );
  });

  // TODO EASI-4984: test section locks once context is implemented
});
