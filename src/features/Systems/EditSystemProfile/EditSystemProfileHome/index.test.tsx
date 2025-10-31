import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { systemProfileSections } from 'constants/systemProfile';

import EditSystemProfileHome from './index';

// TODO EASI-4984 - remove feature flag tests once editable system profile feature is fully enabled

const mockUseFlags = vi.fn();

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => mockUseFlags()
}));

describe('EditSystemProfileHome (editableSystemProfile flag disabled)', () => {
  beforeEach(() => {
    mockUseFlags.mockReturnValue({
      editableSystemProfile: false
    });
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
        <EditSystemProfileHome systemId="000-100-0" systemName="Test System" />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  systemProfileSections.forEach(section => {
    it(`renders the ${section.key} card (section flag disabled)`, () => {
      render(
        <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
          <Route path="/systems/:systemId/edit">
            <EditSystemProfileHome
              systemId="000-100-0"
              systemName="Test System"
            />
          </Route>
        </MemoryRouter>
      );

      // Business information card should be hidden
      if (section.key === 'BUSINESS_INFORMATION') {
        expect(
          screen.queryByTestId(`section-card-${section.key}`)
        ).not.toBeInTheDocument();
        return;
      }

      const card = screen.getByTestId(`section-card-${section.key}`);
      const cardLink = within(card).getByRole('link');

      expect(cardLink).toHaveAttribute(
        'href',
        `/systems/000-100-0/${section.legacyRoute}`
      );

      if (section.key === 'TEAM') {
        expect(cardLink).toHaveTextContent('Edit section');
        return;
      }

      expect(cardLink).toHaveTextContent('View section');

      expect(
        within(card).getByText('Data managed externally')
      ).toBeInTheDocument();
    });

    it(`renders the ${section.key} card (section flag enabled)`, () => {
      mockUseFlags.mockReturnValue({
        [section.featureFlag]: true
      });

      render(
        <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
          <Route path="/systems/:systemId/edit">
            <EditSystemProfileHome
              systemId="000-100-0"
              systemName="Test System"
            />
          </Route>
        </MemoryRouter>
      );

      // Renders all cards
      expect(
        screen.getByTestId(`section-card-${section.key}`)
      ).toBeInTheDocument();

      const card = screen.getByTestId(`section-card-${section.key}`);
      const cardLink = within(card).getByRole('link');

      expect(cardLink).toHaveAttribute(
        'href',
        `/systems/000-100-0/edit/${section.route}`
      );

      const sectionIsEditable = section.key in SystemProfileLockableSection;

      if (sectionIsEditable) {
        expect(cardLink).toHaveTextContent('Edit section');
        expect(
          within(card).queryByText('Data managed externally')
        ).not.toBeInTheDocument();
      } else {
        expect(cardLink).toHaveTextContent('View section');
        expect(
          within(card).getByText('Data managed externally')
        ).toBeInTheDocument();
      }
    });
  });
});

// Snapshot for global feature flag override
describe('EditSystemProfileHome (editableSystemProfile flag enabled)', () => {
  beforeEach(() => {
    mockUseFlags.mockReturnValue({
      editableSystemProfile: true
    });
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/edit']}>
        <EditSystemProfileHome systemId="000-100-0" systemName="Test System" />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
