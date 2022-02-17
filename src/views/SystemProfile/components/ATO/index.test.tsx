import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import {
  activities,
  developmentTags,
  locationsInfo,
  mockSystemInfo
} from 'views/Sandbox/mockSystemData';

import ATO from './index';

describe('ATO sub page for System Profile', () => {
  it('renders the progress page when status of In Progress', async () => {
    render(
      <MemoryRouter initialEntries={['/systems/326-9-0/ato']}>
        <Route path="/systems/:systemId/:subinfo">
          <ATO
            system={{
              ...mockSystemInfo[3],
              locations: locationsInfo,
              developmentTags,
              activities,
              atoStatus: 'In Progress'
            }}
          />
        </Route>
      </MemoryRouter>
    );

    // Checking to see if all the steps of progress are rendered with the owner
    await waitFor(() => {
      expect(screen.getAllByText('Jane Doe').length).toBe(5);
    });
  });

  it('renders a yellow card for In Progress', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <ATO
          system={{
            ...mockSystemInfo[3],
            locations: locationsInfo,
            developmentTags,
            activities,
            atoStatus: 'In Progress'
          }}
        />
      </MemoryRouter>
    );

    expect(getByTestId('Card')).toHaveClass('bg-warning');
  });

  it('renders a green card for Active', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <ATO
          system={{
            ...mockSystemInfo[3],
            locations: locationsInfo,
            developmentTags,
            activities,
            atoStatus: 'Active'
          }}
        />
      </MemoryRouter>
    );

    // USWDS utility class for shade of green
    expect(getByTestId('Card')).toHaveClass('bg-success-dark');
  });

  it('renders a red card for Expired', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <ATO
          system={{
            ...mockSystemInfo[3],
            locations: locationsInfo,
            developmentTags,
            activities,
            atoStatus: 'Expired'
          }}
        />
      </MemoryRouter>
    );

    // USWDS utility class for shade of red
    expect(getByTestId('Card')).toHaveClass('bg-error-dark');
  });

  it('renders a grey card for No ATO', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <ATO
          system={{
            ...mockSystemInfo[3],
            locations: locationsInfo,
            developmentTags,
            activities,
            atoStatus: 'No ATO'
          }}
        />
      </MemoryRouter>
    );

    // USWDS utility class for shade of grey
    expect(getByTestId('Card')).toHaveClass('bg-base-lighter');
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/systems/326-9-0/ato']}>
        <Route path="/systems/:systemId/:subinfo">
          <ATO
            system={{
              ...mockSystemInfo[3],
              ...locationsInfo,
              ...developmentTags,
              activities,
              atoStatus: 'In Progress'
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
