import React from 'react';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';
import i18next from 'i18next';

import { mockDiscussions } from 'data/mock/discussions';
import { getRelativeDate } from 'utils/date';

import DiscussionPost from '.';

const [discussion] = mockDiscussions();
const { initialPost, replies } = discussion;

describe('DiscussionPost', () => {
  it('renders a discussion post with replies', () => {
    render(
      <DiscussionPost
        {...discussion.initialPost}
        replies={discussion.replies}
      />
    );

    const {
      createdByUserAccount: { commonName },
      grbRole,
      votingRole,
      createdAt
    } = initialPost;

    expect(screen.getByText(commonName)).toBeInTheDocument();

    const formattedRole = `${i18next.t(`grbReview:votingRoles.${votingRole}`)}, ${i18next.t(`grbReview:reviewerRoles.${grbRole}`)}`;
    expect(
      screen.getByRole('heading', { level: 5, name: formattedRole })
    ).toBeInTheDocument();

    const dateText = getRelativeDate(createdAt);
    expect(screen.getByText(dateText)).toBeInTheDocument();

    const repliesCount = replies.length;
    expect(
      screen.getByRole('button', { name: `${repliesCount} replies` })
    ).toBeInTheDocument();

    const lastReplyAtText = i18next.t('discussions:general.lastReply', {
      date: getRelativeDate(replies[0].createdAt, 1),
      time: '10:00 AM'
    });
    expect(screen.getByText(lastReplyAtText)).toBeInTheDocument();
  });

  it('renders a discussion post without replies', () => {
    render(<DiscussionPost {...discussion.initialPost} replies={[]} />);

    expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument();

    expect(screen.queryByTestId('lastReplyAtText')).toBeNull();
  });

  it('hides discussion reply data', () => {
    render(<DiscussionPost {...discussion.initialPost} />);

    expect(screen.queryByTestId('discussionReplies')).toBeNull();
  });

  it('displays roles fallback text', () => {
    const discussionNoRole: SystemIntakeGRBReviewDiscussionFragment = {
      ...discussion,
      initialPost: {
        ...initialPost,
        grbRole: null,
        votingRole: null
      }
    };

    render(
      <DiscussionPost
        {...discussionNoRole.initialPost}
        replies={discussionNoRole.replies}
      />
    );

    expect(screen.getByText('Governance Admin Team')).toBeInTheDocument();
  });
});