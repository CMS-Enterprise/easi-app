import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SystemIntakeGRBReviewDiscussionFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { mockDiscussions } from 'tests/mock/discussions';
import users from 'tests/mock/users';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Discussion from '.';

describe('Discussion component', () => {
  const discussions = mockDiscussions();
  const { systemIntakeID } = discussions[0].initialPost;

  it('renders the discussion', () => {
    const [discussion] = discussions;

    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <Discussion
            mentionSuggestions={[]}
            discussion={discussion}
            closeModal={vi.fn()}
            setDiscussionAlert={vi.fn()}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Discussion' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(discussion.initialPost.createdByUserAccount.commonName)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 4,
        name: i18next.t('discussions:general.repliesCount', {
          count: discussion.replies.length
        })
      })
    ).toBeInTheDocument();

    // Should not show view more replies button with only two replies
    expect(
      screen.queryByRole('button', { name: 'View more replies' })
    ).toBeNull();
  });

  it('renders the replies', () => {
    const discussion: SystemIntakeGRBReviewDiscussionFragment = {
      ...discussions[0],
      replies: [
        ...discussions[0].replies,
        {
          __typename: 'SystemIntakeGRBReviewDiscussionPost',
          id: '49eacd80-cb13-46f3-8d74-def73e15a71e',
          content: '<p>This is a reply.</p>',
          votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
          grbRole: SystemIntakeGRBReviewerRole.PROGRAM_OPERATIONS_BDG_CHAIR,
          createdByUserAccount: {
            __typename: 'UserAccount',
            id: '859cd654-9fff-48d8-a9aa-a8a6491922b1',
            commonName: users[4].commonName
          },
          systemIntakeID,
          createdAt: '2024-11-13T10:00:00.368862Z'
        },
        {
          __typename: 'SystemIntakeGRBReviewDiscussionPost',
          id: '6d194b86-13fc-4d21-87e1-70dfb1514cf7',
          content: '<p>This is a reply.</p>',
          votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
          grbRole: SystemIntakeGRBReviewerRole.CO_CHAIR_CIO,
          createdByUserAccount: {
            __typename: 'UserAccount',
            id: '25d5e6cd-0cb9-4db8-aa9a-09458400ee7f',
            commonName: users[8].commonName
          },
          systemIntakeID,
          createdAt: '2024-11-13T10:00:00.368862Z'
        },
        {
          __typename: 'SystemIntakeGRBReviewDiscussionPost',
          id: '46e23f3f-37f5-4f50-87da-cf849df181d7',
          content: '<p>This is a reply.</p>',
          votingRole: SystemIntakeGRBReviewerVotingRole.ALTERNATE,
          grbRole: SystemIntakeGRBReviewerRole.CCIIO_REP,
          createdByUserAccount: {
            __typename: 'UserAccount',
            id: 'b5630d2b-89a0-4e7e-afd8-e2aa65f23823',
            commonName: users[1].commonName
          },
          systemIntakeID,
          createdAt: '2024-11-13T10:00:00.368862Z'
        }
      ]
    };

    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <Discussion
            mentionSuggestions={[]}
            discussion={discussion}
            closeModal={vi.fn()}
            setDiscussionAlert={vi.fn()}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    // Toggle view more replies

    const repliesList = screen.getByTestId('discussionsList');

    expect(within(repliesList).getAllByRole('listitem')).toHaveLength(4);

    const viewMoreButton = screen.getByRole('button', {
      name: 'View more replies'
    });

    userEvent.click(viewMoreButton);

    expect(within(repliesList).getAllByRole('listitem')).toHaveLength(
      discussion.replies.length
    );

    expect(
      screen.getByRole('button', { name: 'View less replies' })
    ).toBeInTheDocument();

    // Toggle hide replies

    const hideRepliesButton = screen.getByRole('button', {
      name: 'Hide replies'
    });

    userEvent.click(hideRepliesButton);

    expect(screen.queryByTestId('discussionList')).toBeNull();

    expect(
      screen.getByRole('button', { name: 'Show replies' })
    ).toBeInTheDocument();
  });
});
