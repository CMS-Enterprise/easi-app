import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import { grbReviewers } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';

import DecisionRecord from '.';

describe('GRB review decision record table', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <DecisionRecord
          systemIntakeId={systemIntake.id}
          grbReviewers={grbReviewers}
        />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the GRB reviewers', () => {
    render(
      <MemoryRouter>
        <DecisionRecord
          systemIntakeId={systemIntake.id}
          grbReviewers={grbReviewers}
        />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('row')).toHaveLength(
      // Add one to account for header row
      grbReviewers.length + 1
    );

    // Check specific reviewer info has been rendered
    const mockReviewer = grbReviewers[1];

    const renderedReviewerRow = screen.getByTestId(
      `grbReviewer-${mockReviewer.userAccount.username}`
    );

    expect(
      within(renderedReviewerRow).getByText(mockReviewer.userAccount.commonName)
    ).toBeInTheDocument();

    expect(
      within(renderedReviewerRow).getByText(
        i18next.t<string>(`grbReview:reviewerRoles.${mockReviewer.grbRole}`)
      )
    ).toBeInTheDocument();

    expect(
      within(renderedReviewerRow).getByText(
        i18next.t<string>(`grbReview:votingRoles.${mockReviewer.votingRole}`)
      )
    ).toBeInTheDocument();
  });

  it('Opens the vote comment modal', async () => {
    render(
      <MemoryRouter>
        <DecisionRecord
          systemIntakeId={systemIntake.id}
          grbReviewers={grbReviewers}
        />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    const mockReviewer = grbReviewers[1];

    const renderedReviewerRow = screen.getByTestId(
      `grbReviewer-${mockReviewer.userAccount.username}`
    );

    const viewCommentButton = within(renderedReviewerRow).getByRole('button', {
      name: 'View comment'
    });

    await user.click(viewCommentButton);

    const modal = screen.getByRole('dialog');

    expect(
      within(modal).getByRole('heading', { level: 2, name: 'GRB comment' })
    ).toBeInTheDocument();

    expect(within(modal).getByText('No objection'));

    expect(within(modal).getByText(mockReviewer.voteComment!));
  });
});
