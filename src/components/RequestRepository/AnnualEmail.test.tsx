import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GetRequesterUpdateEmailDataDocument } from 'gql/generated/graphql';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AnnualEmail from './AnnualEmail';

const today = new Date();
const retiringSoonDate = new Date(today);
retiringSoonDate.setDate(today.getDate() + 92);
const retiredRecentlyDate = new Date(today);
retiredRecentlyDate.setDate(today.getDate() - 25);
const expiredDate = new Date(today);
expiredDate.setFullYear(today.getFullYear() - 1);

const mocks = [
  {
    request: {
      query: GetRequesterUpdateEmailDataDocument
    },
    result: {
      data: {
        requesterUpdateEmailData: [
          {
            lcidStatus: 'ISSUED',
            lcidIssuedAt: '2024-01-01T00:00:00Z',
            lcidExpiresAt: '2025-12-01T00:00:00Z',
            lcidRetiresAt: null,
            requesterEmail: 'active@example.com'
          },
          {
            lcidStatus: 'EXPIRED',
            lcidIssuedAt: '2023-01-01T00:00:00Z',
            lcidExpiresAt: expiredDate.toISOString(),
            lcidRetiresAt: null,
            requesterEmail: 'expired@example.com'
          },
          {
            lcidStatus: 'ISSUED',
            lcidIssuedAt: '2024-01-01T00:00:00Z',
            lcidExpiresAt: '2025-12-01T00:00:00Z',
            lcidRetiresAt: retiringSoonDate.toISOString(),
            requesterEmail: 'retiring-soon@example.com'
          },
          {
            lcidStatus: 'RETIRED',
            lcidIssuedAt: '2023-01-01T00:00:00Z',
            lcidExpiresAt: '2023-12-01T00:00:00Z',
            lcidRetiresAt: retiredRecentlyDate.toISOString(),
            requesterEmail: 'retired-recently@example.com'
          }
        ]
      }
    }
  }
];

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn()
    }
  });
});

describe('AnnualEmail UI & Clipboard Behavior', () => {
  it('renders checkboxes and disables submit button by default', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(await screen.findByTestId('button'));

    expect(await screen.findByTestId('checkbox-ISSUED')).toBeInTheDocument();
    expect(screen.getByText(/Open in email/i)).toBeDisabled();
  });

  it('enables buttons and copies correct email on "Active"', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(await screen.findByTestId('button'));
    const checkbox = await screen.findByTestId('checkbox-ISSUED');
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());

    fireEvent.click(screen.getByText(/copy emails to clipboard/i));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'active@example.com'
      );
    });
  });

  it('copies correct email on "Expired"', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(await screen.findByTestId('button'));
    const checkbox = await screen.findByTestId('checkbox-EXPIRED');
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    fireEvent.click(screen.getByText(/copy emails to clipboard/i));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'expired@example.com'
      );
    });
  });

  it('copies correct email on "Retiring Soon"', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(await screen.findByTestId('button'));
    const checkbox = await screen.findByTestId('checkbox-RETIRING_SOON');
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    fireEvent.click(screen.getByText(/copy emails to clipboard/i));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'retiring-soon@example.com'
      );
    });
  });

  it('copies correct email on "Retired Recently"', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(await screen.findByTestId('button'));

    const checkbox = await screen.findByTestId('checkbox-RETIRED_RECENTLY');
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());

    fireEvent.click(screen.getByText(/copy emails to clipboard/i));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'retired-recently@example.com'
      );
    });
  });

  it('shows warning if no matching emails for an empty state', async () => {
    const emptyMock = [
      {
        request: { query: GetRequesterUpdateEmailDataDocument },
        result: { data: { requesterUpdateEmailData: [] } }
      }
    ];

    render(
      <MockedProvider mocks={emptyMock} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(await screen.findByTestId('button'));
    const checkbox = await screen.findByTestId('checkbox-EXPIRED');
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    fireEvent.click(screen.getByText(/copy emails to clipboard/i));

    expect(
      await screen.findByText(
        /There are no requester emails that match your selection/i
      )
    ).toBeInTheDocument();
  });
});
