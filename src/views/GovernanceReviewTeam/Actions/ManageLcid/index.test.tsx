import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';

import ManageLcid from '.';

const systemIntakeId = 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2';

describe('Manage LCID selection page', () => {
  it('Renders options for issued LCID', () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntakeId}/manage-lcid`
        ]}
      >
        <Route path={[`/governance-review-team/:systemId/manage-lcid`]}>
          <ManageLcid
            systemIntakeId={systemIntakeId}
            lcidStatus={SystemIntakeLCIDStatus.ISSUED}
          />
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
          `/governance-review-team/${systemIntakeId}/manage-lcid`
        ]}
      >
        <Route path={[`/governance-review-team/:systemId/manage-lcid`]}>
          <ManageLcid
            systemIntakeId={systemIntakeId}
            lcidStatus={SystemIntakeLCIDStatus.RETIRED}
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
