import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';
import i18next from 'i18next';
import { mockDiscussions } from 'tests/mock/discussions';

import RecentDiscussion from '.';

describe('RecentDiscussion', () => {
  it('renders the discussion', () => {
    render(
      <MemoryRouter>
        <RecentDiscussion
          loading={false}
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
          grbDiscussions={mockDiscussions()}
          pushDiscussionQuery={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        i18next.t<string>('discussions:general.mostRecentActivity')
      )
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('discussion-post-', { exact: false })
    ).toBeInTheDocument();
  });

  it('renders alert if no discussions', () => {
    render(
      <MemoryRouter>
        <RecentDiscussion
          loading={false}
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
          grbDiscussions={[]}
          pushDiscussionQuery={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText('There are not yet any discussions', { exact: false })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Start a discussion' })
    ).toBeInTheDocument();
  });
});
