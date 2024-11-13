import {
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/gen/graphql';

import users from './users';

interface Discussion {
  id: string;
  author: SystemIntakeGRBReviewerFragment;
  createdAt: string;
  text: string;
}

export interface DiscussionWithReplies extends Discussion {
  replies: Discussion[];
}

const replies: Discussion[] = [
  {
    id: '2c29bc6b-b7eb-4b1c-a121-3445d69cbd47',
    author: {
      __typename: 'SystemIntakeGRBReviewer',
      id: '958bcb2b-08a4-4afa-aad6-df20e5632377',
      grbRole: SystemIntakeGRBReviewerRole.CCIIO_REP,
      votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
      userAccount: {
        __typename: 'UserAccount',
        id: '35a18c78-5673-4b90-b4df-41b0f7f99ff7',
        username: users[1].euaUserId,
        commonName: users[1].commonName,
        email: users[1].email
      }
    },
    createdAt: '2024-11-12T21:59:07.368862Z',
    text: '<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>'
  },
  {
    id: '50f31666-3344-438c-9ef8-7c89cbaa9071',
    author: {
      __typename: 'SystemIntakeGRBReviewer',
      id: '98628fbe-7d86-41ff-904c-c6333e5345bd',
      grbRole: SystemIntakeGRBReviewerRole.CCIIO_REP,
      votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
      userAccount: {
        __typename: 'UserAccount',
        id: '57ce2ba7-6462-4811-82e0-aa025fc52ef0',
        username: users[0].euaUserId,
        commonName: users[0].commonName,
        email: users[0].email
      }
    },
    createdAt: '2024-11-12T21:59:07.368862Z',
    text: '<p>Nisi nobis consectetur voluptatem neque tempore. Ea nihil sed beatae?</p>'
  }
];

export const discussionWithReplies: DiscussionWithReplies = {
  id: '783b7f3a-9d20-43b2-a8f4-f88bd092ed18',
  author: {
    __typename: 'SystemIntakeGRBReviewer',
    id: '98628fbe-7d86-41ff-904c-c6333e5345bd',
    grbRole: SystemIntakeGRBReviewerRole.SUBJECT_MATTER_EXPERT,
    votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
    userAccount: {
      __typename: 'UserAccount',
      id: 'fdb78d66-20f3-4fc4-9c34-706a14bb221d',
      username: users[0].euaUserId,
      commonName: users[0].commonName,
      email: users[0].email
    }
  },
  createdAt: '2024-11-12T21:59:07.368862Z',
  text: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
  replies
};
