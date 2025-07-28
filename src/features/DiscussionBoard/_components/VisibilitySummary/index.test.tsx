import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';

import VisibilitySummary from '.';

describe('VisibilitySummary', () => {
  it('renders the visibility summary for the Primary discussion board', () => {
    const { asFragment } = render(
      <VisibilitySummary
        discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
      />
    );

    expect(asFragment()).toMatchSnapshot();

    const rolesList = within(
      screen.getByTestId('visibility-summary')
    ).getByRole('list');

    expect(
      within(rolesList)
        .getAllByRole('listitem')
        .find(item => item.textContent === 'Requester')
    ).toBeInTheDocument();

    expect(
      within(rolesList)
        .getAllByRole('listitem')
        .find(item => item.textContent === 'Governance Review Board (GRB)')
    ).toBeInTheDocument();

    expect(
      within(rolesList)
        .getAllByRole('listitem')
        .find(item => item.textContent === 'Governance Admin Team')
    ).toBeInTheDocument();
  });

  it('renders the visibility summary for the Internal discussion board', () => {
    render(
      <VisibilitySummary
        discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
      />
    );

    const rolesList = within(
      screen.getByTestId('visibility-summary')
    ).getByRole('list');

    expect(
      within(rolesList)
        .getAllByRole('listitem')
        .find(item => item.textContent === 'Requester')
    ).toBeUndefined();
  });
});
