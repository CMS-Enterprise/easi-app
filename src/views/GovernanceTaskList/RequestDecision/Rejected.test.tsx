import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';

import initialSystemIntakeForm from 'data/systemIntake';

import Rejected from './Rejected';

describe('Business owner task list rejected view', () => {
  const rejectedIntake = {
    ...initialSystemIntakeForm,
    id: '40e866cb-6bf4-4b1a-8fc6-bf0d8328cdfc',
    rejectionReason: 'Test rejection reason',
    decisionNextSteps: 'Test next steps'
  };
  it('renders without errors', () => {
    render(
      <MemoryRouter>
        <Rejected intake={rejectedIntake} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('grt-rejected')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Rejected intake={rejectedIntake} />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
