import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';
import i18next from 'i18next';
import {
  mockDiscussions,
  mockDiscussionsWithoutReplies
} from 'tests/mock/discussions';

import ViewDiscussions from '.';

describe('ViewDiscussions component', () => {
  const noNewDiscussionsText = i18next.t(
    'discussions:general.alerts.noDiscussionsStarted'
  );

  const noDiscussionsWithRepliesText = i18next.t(
    'discussions:general.alerts.noDiscussionsRepliedTo'
  );

  it('renders the component', () => {
    render(
      <MemoryRouter>
        <ViewDiscussions
          grbDiscussions={mockDiscussions()}
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Internal GRB discussion board'
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>('discussions:governanceReviewBoard.description', {
          context: 'INTERNAL'
        })
      )
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Discussions' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Start a new discussion' })
    ).toBeInTheDocument();

    expect(screen.getByTestId('accordion')).toBeInTheDocument();
  });

  it('renders alerts for no discussion posts', () => {
    render(
      <MemoryRouter>
        <ViewDiscussions
          grbDiscussions={[]}
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(noNewDiscussionsText)).toBeInTheDocument();

    expect(screen.getByText(noDiscussionsWithRepliesText)).toBeInTheDocument();
  });

  it('renders accordion components with formatted discussion lists', () => {
    const grbDiscussions = [
      ...mockDiscussions(),
      ...mockDiscussionsWithoutReplies()
    ];

    const discussionsWithReplies = grbDiscussions.filter(
      discussion => discussion.replies.length > 0
    );
    const discussionsWithoutReplies = grbDiscussions.filter(
      discussion => discussion.replies.length === 0
    );

    render(
      <MemoryRouter>
        <ViewDiscussions
          grbDiscussions={grbDiscussions}
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
        />
      </MemoryRouter>
    );

    /* Discussions with replies */

    expect(
      screen.getByRole('heading', {
        level: 4,
        name: i18next.t('discussions:general.discussedTopics', {
          count: discussionsWithReplies.length
        })
      })
    ).toBeInTheDocument();

    /* New discussions without replies */

    expect(
      screen.getByRole('heading', {
        level: 4,
        name: i18next.t('discussions:general.newTopics', {
          count: discussionsWithoutReplies.length
        })
      })
    ).toBeInTheDocument();

    const newDiscussionsAccordion = screen.getByTestId(
      'accordionItem_grbDiscussionsNew'
    );

    const newDiscussionListItems = within(newDiscussionsAccordion).getAllByRole(
      'listitem'
    );

    // Unexpanded list should display three items
    expect(newDiscussionListItems).toHaveLength(3);

    const expandButton = within(newDiscussionsAccordion).getByRole('button', {
      name: 'View more discussions'
    });

    userEvent.click(expandButton);

    const expandedNewDiscussionListItems = within(
      newDiscussionsAccordion
    ).getAllByRole('listitem');

    // Expanded list should display all items
    expect(expandedNewDiscussionListItems).toHaveLength(
      discussionsWithoutReplies.length
    );
  });

  it('renders the primary discussion board', () => {
    render(
      <MemoryRouter>
        <ViewDiscussions
          grbDiscussions={mockDiscussions()}
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Primary discussion board'
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>('discussions:governanceReviewBoard.description', {
          context: 'PRIMARY'
        })
      )
    );
  });
});
