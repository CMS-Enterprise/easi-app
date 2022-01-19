import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import GetCedarSystemsAndBookmarksQuery from 'queries/GetCedarSystemsAndBookmarksQuery';
import { mapCedarStatusToIcon } from 'types/iconStatus';
import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import BookmarkCard from './index';

describe('BookmarkCard', () => {
  const mocks = [
    {
      request: {
        query: GetCedarSystemsAndBookmarksQuery
      },
      result: {
        data: {
          cedarSystems: [],
          cedarSystemBookmarks: []
        }
      }
    }
  ];

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[0].status)}
            refetch={() => {}}
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
        <MockedProvider mocks={mocks}>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[0].status)}
            refetch={() => {}}
            {...mockSystemInfo[0]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    // TODO Update expected text output when translations/headings of systemList get solidifed
    expect(getByText('Happiness Achievement Module')).toBeInTheDocument();
    expect(getByText('CMS Component')).toBeInTheDocument();
    expect(getByText('ATO Status')).toBeInTheDocument();
  });

  it('renders corresponding success health icon for status', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[0].status)}
            refetch={() => {}}
            {...mockSystemInfo[0]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(getByTestId('system-health-icon')).toHaveClass(
      'system-health-icon-success'
    );
  });

  it('renders corresponding warning health icon for status', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[1].status)}
            refetch={() => {}}
            {...mockSystemInfo[1]}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(getByTestId('system-health-icon')).toHaveClass(
      'system-health-icon-fail'
    );
  });

  it('renders corresponding fail health icon for status', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <BookmarkCard
            type="systemProfile"
            statusIcon={mapCedarStatusToIcon(mockSystemInfo[2].status)}
            refetch={() => {}}
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
