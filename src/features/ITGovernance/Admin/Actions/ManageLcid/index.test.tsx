import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import { systemIntake as mockSystemIntake } from 'tests/mock/systemIntake';

import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';

import LcidTitleBox from './LcidTitleBox';
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
        initialEntries={[`/it-governance/${systemIntake.id}/manage-lcid`]}
      >
        <Route path={[`/it-governance/:systemId/manage-lcid`]}>
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
        initialEntries={[`/it-governance/${systemIntake.id}/manage-lcid`]}
      >
        <Route path={[`/it-governance/:systemId/manage-lcid`]}>
          <ManageLcid
            systemIntake={{
              ...systemIntake,
              lcidStatus: SystemIntakeLCIDStatus.RETIRED
            }}
          />
        </Route>
      </MemoryRouter>
    );

    expect(screen.getAllByRole('radio')).toHaveLength(3);

    expect(
      screen.getByRole('radio', { name: 'Change retirement date' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: 'Remove retirement date' })
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
