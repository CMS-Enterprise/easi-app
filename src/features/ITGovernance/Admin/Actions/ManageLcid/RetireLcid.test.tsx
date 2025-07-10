import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemIntakeLCIDStatus } from 'gql/generated/graphql';
import i18next from 'i18next';
import { DateTime } from 'luxon';
import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { formatDateLocal } from 'utils/date';

import RetireLcid from './RetireLcid';

const renderComponent = (lcidRetiresAt?: string) =>
  render(
    <MemoryRouter>
      <MockedProvider
        mocks={[getSystemIntakeContactsQuery, getSystemIntakeQuery()]}
      >
        <MessageProvider>
          <RetireLcid
            systemIntakeId={systemIntake.id}
            lcidStatus={SystemIntakeLCIDStatus.ISSUED}
            lcid="123456"
            lcidRetiresAt={lcidRetiresAt || null}
          />
        </MessageProvider>
      </MockedProvider>
    </MemoryRouter>
  );

describe('Retire LCID action form', async () => {
  it('renders form for retiring LCID', async () => {
    renderComponent();

    // Check selected action title
    expect(
      await screen.findByText('Retire a Life Cycle ID')
    ).toBeInTheDocument();

    // Reason field shows if setting initial retirement date
    expect(
      screen.getByLabelText(
        'Why are you retiring this Life Cycle ID? (optional)'
      )
    ).toBeInTheDocument();
  });

  it('renders form for updating retirement date', async () => {
    const dateInFuture = DateTime.local().plus({ year: 1 }).toISO();
    renderComponent(dateInFuture);

    expect(
      await screen.findByText('Change retirement date')
    ).toBeInTheDocument();

    // Wait for the external input to be populated
    const expectedValue = formatDateLocal(dateInFuture, 'MM/dd/yyyy');

    await screen.findByDisplayValue(expectedValue);

    expect(
      screen.queryByText(i18next.t<string>('action:pastDateAlert'))
    ).toBeNull();

    expect(
      screen.queryByRole('textbox', {
        name: 'Why are you retiring this Life Cycle ID? (optional)'
      })
    ).toBeNull();
  });

  it('renders alert if retirement date is in the past', async () => {
    renderComponent();

    const retireDateField = await screen.findByRole('textbox', {
      name: 'Life Cycle ID retirement date *'
    });

    userEvent.type(retireDateField, '01/01/2023');

    expect(
      screen.getByText(i18next.t<string>('action:pastDateAlert'))
    ).toBeInTheDocument();
  });
});
