import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GetRequesterUpdateEmailDataDocument } from 'gql/generated/graphql';
import i18next from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AnnualEmail from './AnnualEmail';

const now = new Date();
const within120Days = new Date(
  now.getTime() - 100 * 24 * 60 * 60 * 1000
).toISOString();

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
            lcidIssuedAt: '2099-06-01T00:00:00Z',
            lcidExpiresAt: '2099-06-01T00:00:00Z',
            lcidRetiresAt: null,
            requesterEmail: 'active@example.com'
          },
          {
            lcidStatus: 'EXPIRED',
            lcidIssuedAt: '2099-06-01T00:00:00Z',
            lcidExpiresAt: '2023-06-01T00:00:00Z',
            lcidRetiresAt: null,
            requesterEmail: 'expired@example.com'
          },
          {
            lcidStatus: 'RETIRED',
            lcidIssuedAt: '2022-01-01T00:00:00Z',
            lcidExpiresAt: '2023-01-01T00:00:00Z',
            lcidRetiresAt: within120Days,
            requesterEmail: 'retired@example.com'
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

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18next.t('home:adminHome.GRT.requesterUpdateEmail.card.button')
      })
    );

    expect(await screen.findByLabelText(/Active/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: i18next.t(
          'home:adminHome.GRT.requesterUpdateEmail.modal.openEmailButton'
        )
      })
    ).toBeDisabled();
  });

  it('enables buttons and copies correct email on "Active"', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18next.t('home:adminHome.GRT.requesterUpdateEmail.card.button')
      })
    );
    fireEvent.click(screen.getByLabelText(/Active/));

    const copyBtn = screen.getByRole('button', {
      name: /or, copy emails to clipboard/i
    });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'active@example.com'
      );
    });
  });

  it('shows warning if no matching emails for "Retiring soon"', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18next.t('home:adminHome.GRT.requesterUpdateEmail.card.button')
      })
    );
    fireEvent.click(screen.getByLabelText(/Retiring soon/));

    const copyBtn = screen.getByRole('button', {
      name: i18next.t(
        'home:adminHome.GRT.requesterUpdateEmail.modal.copyEmailButton'
      )
    });
    fireEvent.click(copyBtn);

    expect(
      await screen.findByText(
        i18next.t(
          'home:adminHome.GRT.requesterUpdateEmail.modal.noEmail'
        ) as string
      )
    ).toBeInTheDocument();
  });

  it('copies correct email on "Retired" status', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AnnualEmail />
      </MockedProvider>
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18next.t('home:adminHome.GRT.requesterUpdateEmail.card.button')
      })
    );

    // Wait for modal content
    await screen.findByLabelText(/Retired/);
    fireEvent.click(screen.getByLabelText(/Retired/));

    // Wait for buttons to become enabled
    const copyBtn = await screen.findByRole('button', {
      name: i18next.t(
        'home:adminHome.GRT.requesterUpdateEmail.modal.copyEmailButton'
      )
    });

    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'retired@example.com'
      );
    });
  });
});
