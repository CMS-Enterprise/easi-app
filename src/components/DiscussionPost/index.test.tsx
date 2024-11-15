import React from 'react';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';
import i18next from 'i18next';

import mockDiscussions from 'data/mock/discussions';
import { getRelativeDate } from 'utils/date';

import DiscussionPost from '.';

const [discussion] = mockDiscussions();
const { initialPost, replies } = discussion;

describe('DiscussionPost', () => {
  it('renders the discussion post', () => {
    render(<DiscussionPost discussion={discussion} />);

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

    expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument();

    const repliesCount = replies.length;
    expect(
      screen.getByText(`${repliesCount} replies in this discussion`)
    ).toBeInTheDocument();
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

    render(<DiscussionPost discussion={discussionNoRole} />);

    expect(screen.getByText('Governance Admin Team')).toBeInTheDocument();
  });
});
