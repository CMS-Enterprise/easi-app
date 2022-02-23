import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { mockSystemInfo, products } from 'views/Sandbox/mockSystemData';

import ToolsAndSoftware from './index';

describe('System Tools and Software subpage', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/systems/326-9-0/tools-and-software']}>
        <Route path="/systems/:systemId/:subinfo">
          <ToolsAndSoftware
            system={{
              ...mockSystemInfo[3],
              products
            }}
          />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Drupal')).toBeInTheDocument();
      expect(screen.getByText('Software Development')).toBeInTheDocument();
      expect(screen.getByText('API Gateway')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/systems/326-9-0/tools-and-software']}>
        <Route path="/systems/:systemId/:subinfo">
          <ToolsAndSoftware
            system={{
              ...mockSystemInfo[3],
              products
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
