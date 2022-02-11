import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { mockSystemInfo, subSystems } from 'views/Sandbox/mockSystemData';

import ToolsAndSoftware from './index';

describe('System Sub-systems subpage', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/system-profile/326-9-0/sub-systems']}>
        <Route path="/system-profile/:systemId/:subinfo">
          <ToolsAndSoftware
            system={{
              ...mockSystemInfo[3],
              subSystems
            }}
          />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Test Ocular Fiction Utensil')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Planned retirement: Q4 2022')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/system-profile/326-9-0/sub-systems']}>
        <Route path="/system-profile/:systemId/:subinfo">
          <ToolsAndSoftware
            system={{
              ...mockSystemInfo[3],
              subSystems
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
