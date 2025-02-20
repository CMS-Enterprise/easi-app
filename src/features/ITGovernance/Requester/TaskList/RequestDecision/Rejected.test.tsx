import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemIntake } from 'gql/legacyGQL/types/SystemIntake';

import { initialSystemIntakeForm } from 'data/systemIntake';
import { SystemIntakeForm } from 'types/systemIntake';

import Rejected from './Rejected';

describe('Business Owner task list rejected view', () => {
  const rejectedIntake: SystemIntake = {
    ...initialSystemIntakeForm,
    id: '40e866cb-6bf4-4b1a-8fc6-bf0d8328cdfc',
    rejectionReason: 'Test rejection reason',
    decisionNextSteps: 'Test next steps'
  } as SystemIntakeForm & SystemIntake;
  it('renders without errors', () => {
    render(
      <MemoryRouter>
        <Rejected intake={rejectedIntake} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('grt-rejected')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Rejected intake={rejectedIntake} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
