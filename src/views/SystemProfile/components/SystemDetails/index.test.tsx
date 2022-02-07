import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import {
  developmentTags,
  locationsInfo,
  mockSystemInfo
} from 'views/Sandbox/mockSystemData';

import SystemDetails from './index';

describe('The making a request page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/system-profile/326-9-0/details']}>
        <Route path="/system-profile/:systemId/:subinfo">
          <SystemDetails
            system={{
              ...mockSystemInfo[3],
              locations: locationsInfo,
              developmentTags
            }}
          />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(screen.getByText('ham.cms.gov')).toBeInTheDocument();
      expect(screen.getByText('Code Repository')).toBeInTheDocument();
      expect(screen.getAllByText('Agile Methodology')[0]).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/system-profile/326-9-0/details']}>
        <Route path="/system-profile/:systemId/:subinfo">
          <SystemDetails
            system={{
              ...mockSystemInfo[3],
              ...locationsInfo,
              ...developmentTags
            }}
          />
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
