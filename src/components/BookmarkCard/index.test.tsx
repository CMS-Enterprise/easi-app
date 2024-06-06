import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import { mapCedarStatusToIcon } from 'types/iconStatus';
import { mockSystemInfo } from 'views/SystemProfile/mockSystemData';

import BookmarkCard from './index';

describe('BookmarkCard', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[0].status)}
            {...mockSystemInfo[0]}
          />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders translated headings', () => {
    const { getByText } = render(
      <MemoryRouter>
        <MockedProvider>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[0].status)}
            {...mockSystemInfo[0]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    // TODO Update expected text output when translations/headings of systemList get solidifed
    expect(getByText('Happiness Achievement Module')).toBeInTheDocument();
    expect(getByText('CMS Component')).toBeInTheDocument();
    // expect(getByText('ATO Status')).toBeInTheDocument();
  });

  //
  // Skip render status tests until the appropriate data for status is available
  //

  it.skip('renders corresponding success health icon for status', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MockedProvider>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[0].status)}
            {...mockSystemInfo[0]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(getByTestId('system-health-icon')).toHaveClass(
      'system-health-icon-success'
    );
  });

  it.skip('renders corresponding warning health icon for status', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MockedProvider>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[1].status)}
            {...mockSystemInfo[1]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(getByTestId('system-health-icon')).toHaveClass(
      'system-health-icon-fail'
    );
  });

  it.skip('renders corresponding fail health icon for status', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MockedProvider>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[2].status)}
            {...mockSystemInfo[2]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(getByTestId('system-health-icon')).toHaveClass(
      'system-health-icon-warning'
    );
  });
});
