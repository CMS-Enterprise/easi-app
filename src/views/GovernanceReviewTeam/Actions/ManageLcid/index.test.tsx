import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import { DateTime } from 'luxon';

import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  systemIntake as mockSystemIntake
} from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';

import LcidTitleBox from './LcidTitleBox';
import RetireLcid from './RetireLcid';
import ManageLcid from '.';

const lcidExpiresAt = DateTime.local().plus({ year: 1 }).toISO();

const systemIntake = {
  ...mockSystemIntake,
  lcid: '123456',
  lcidStatus: SystemIntakeLCIDStatus.ISSUED,
  lcidExpiresAt
};

describe('Manage LCID selection page', () => {
  it('Renders options for issued LCID', () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntake.id}/manage-lcid`
        ]}
      >
        <Route path={[`/governance-review-team/:systemId/manage-lcid`]}>
          <ManageLcid systemIntake={systemIntake} />
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Manage a Life Cycle ID (LCID)'
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: 'Retire a Life Cycle ID' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: 'Update a Life Cycle ID' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: 'Expire a Life Cycle ID' })
    ).toBeInTheDocument();
  });

  it('Renders options for retired LCID', () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntake.id}/manage-lcid`
        ]}
      >
        <Route path={[`/governance-review-team/:systemId/manage-lcid`]}>
          <ManageLcid
            systemIntake={{
              ...systemIntake,
              lcidStatus: SystemIntakeLCIDStatus.RETIRED
            }}
          />
        </Route>
      </MemoryRouter>
    );

    expect(screen.getAllByRole('radio')).toHaveLength(2);

    expect(
      screen.getByRole('radio', { name: 'Change retirement date' })
    ).toBeInTheDocument();
  });
});

describe('Manage LCID form', async () => {
  it('Renders title box', async () => {
    const action = 'Update a Life Cycle ID';

    render(
      <MemoryRouter>
        <LcidTitleBox systemIntakeId={systemIntake.id} title={action} />
      </MemoryRouter>
    );

    const title = await screen.findByText('Manage a Life Cycle ID (LCID)');
    expect(title).toBeInTheDocument();

    expect(screen.getByText('Selected action')).toBeInTheDocument();

    expect(screen.getByText(action)).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Change action' })
    ).toBeInTheDocument();
  });
});

describe('Retire LCID action', async () => {
  it('Renders alert if date is in the past', async () => {
    render(
      <MemoryRouter>
        <MockedProvider
          mocks={[getSystemIntakeContactsQuery, getSystemIntakeQuery]}
        >
          <MessageProvider>
            <RetireLcid
              systemIntakeId={systemIntake.id}
              lcidStatus={SystemIntakeLCIDStatus.ISSUED}
              lcid="123456"
              lcidRetiresAt={null}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    const retireDateField = await screen.findByRole('textbox', {
      name: 'Life Cycle ID retirement date *'
    });

    const dateInPast = '01/01/2023';

    userEvent.type(retireDateField, dateInPast);

    expect(
      screen.getByText(i18next.t<string>('action:retireLcid.pastDateAlert'))
    ).toBeInTheDocument();
  });
});
