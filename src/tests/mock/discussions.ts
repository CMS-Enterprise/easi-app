import {
  GetSystemIntakeGRBDiscussionsDocument,
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables,
  SystemIntakeGRBReviewDiscussionFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';

import { MockedQuery } from 'types/util';

import { systemIntake } from './systemIntake';
import users from './users';

export const mockDiscussions = (
  systemIntakeID: string = systemIntake.id
): SystemIntakeGRBReviewDiscussionFragment[] => [
  {
    __typename: 'SystemIntakeGRBReviewDiscussion',
    initialPost: {
      __typename: 'SystemIntakeGRBReviewDiscussionPost',
      id: '882357e4-c0b0-44ef-b749-f71879ad7878',
      content:
        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
      votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
      grbRole: SystemIntakeGRBReviewerRole.SUBJECT_MATTER_EXPERT,
      createdByUserAccount: {
        __typename: 'UserAccount',
        id: '034fa2b3-00ff-4ec6-857e-75291a59df74',
        commonName: users[5].commonName
      },
      systemIntakeID,
      createdAt: '2024-11-12T10:00:00.368862Z'
    },
    replies: [
      {
        __typename: 'SystemIntakeGRBReviewDiscussionPost',
        id: '4099dbb7-2752-4bf9-a3e1-da225ceb9fae',
        content:
          '<p>Nisi nobis consectetur voluptatem neque tempore. Ea nihil sed beatae?</p>',
        votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
        grbRole: SystemIntakeGRBReviewerRole.CMCS_REP,
        createdByUserAccount: {
          __typename: 'UserAccount',
          id: '909a7888-4d6f-4bbf-9b9d-71ec1e2c3068',
          commonName: users[1].commonName
        },
        systemIntakeID,
        createdAt: '2024-11-13T10:00:00.368862Z'
      },
      {
        __typename: 'SystemIntakeGRBReviewDiscussionPost',
        id: '47b0081d-de33-4514-b68f-a7e2bbf2610f',
        content:
          '<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>',
        votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
        grbRole: SystemIntakeGRBReviewerRole.CO_CHAIR_CIO,
        createdByUserAccount: {
          __typename: 'UserAccount',
          id: '601d52be-7baa-4b45-91cd-88b4a5935c3f',
          commonName: users[7].commonName
        },
        systemIntakeID,
        createdAt: '2024-11-13T10:00:00.368862Z'
      }
    ]
  }
];

export const mockDiscussionsWithoutReplies = (
  systemIntakeID: string = systemIntake.id
): SystemIntakeGRBReviewDiscussionFragment[] => [
  {
    __typename: 'SystemIntakeGRBReviewDiscussion',
    initialPost: {
      __typename: 'SystemIntakeGRBReviewDiscussionPost',
      id: 'd6cd88e2-d330-4b7c-9006-d6cf95b775e9',
      content: '<p>This is a discussion without replies.</p>',
      votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
      grbRole: SystemIntakeGRBReviewerRole.CCIIO_REP,
      createdByUserAccount: {
        __typename: 'UserAccount',
        id: '3f750a9d-a2a2-414f-a013-59554ed32c75',
        commonName: users[2].commonName
      },
      systemIntakeID,
      createdAt: '2024-11-18T10:00:00.368862Z'
    },
    replies: []
  },
  {
    __typename: 'SystemIntakeGRBReviewDiscussion',
    initialPost: {
      __typename: 'SystemIntakeGRBReviewDiscussionPost',
      id: '372bf1c0-3f33-4046-a973-bc063f39dc59',
      content: '<p>This is another discussion without replies.</p>',
      votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
      grbRole: SystemIntakeGRBReviewerRole.CO_CHAIR_HCA,
      createdByUserAccount: {
        __typename: 'UserAccount',
        id: '32c29aac-e20c-4fce-9ecb-8eb2f4c87e5f',
        commonName: users[9].commonName
      },
      systemIntakeID,
      createdAt: '2024-11-17T10:00:00.368862Z'
    },
    replies: []
  },
  {
    __typename: 'SystemIntakeGRBReviewDiscussion',
    initialPost: {
      __typename: 'SystemIntakeGRBReviewDiscussionPost',
      id: '39823b79-987d-4f81-9fcb-ae45f4c5bfeb',
      content: '<p>This is a third discussion without replies.</p>',
      votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
      grbRole: SystemIntakeGRBReviewerRole.QIO_REP,
      createdByUserAccount: {
        __typename: 'UserAccount',
        id: 'a9628365-16a5-49bf-9acc-7dbdade7288f',
        commonName: users[3].commonName
      },
      systemIntakeID,
      createdAt: '2024-11-17T9:00:00.368862Z'
    },
    replies: []
  },
  {
    __typename: 'SystemIntakeGRBReviewDiscussion',
    initialPost: {
      __typename: 'SystemIntakeGRBReviewDiscussionPost',
      id: 'df00daf2-f666-4014-98d3-fd28630fe996',
      content:
        '<p>This discussion without replies should not show up until list is expanded.</p>',
      votingRole: SystemIntakeGRBReviewerVotingRole.ALTERNATE,
      grbRole: SystemIntakeGRBReviewerRole.FED_ADMIN_BDG_CHAIR,
      createdByUserAccount: {
        __typename: 'UserAccount',
        id: 'c7eefa37-b917-4fa3-8fc0-b86fa5de7df2',
        commonName: users[8].commonName
      },
      systemIntakeID,
      createdAt: '2024-11-17T9:30:00.368862Z'
    },
    replies: []
  }
];

/** Array of discussions with and without replies */
const grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[] = [
  ...mockDiscussions(),
  ...mockDiscussionsWithoutReplies()
];

export const getSystemIntakeGRBDiscussionsQuery = (
  data: {
    grbDiscussionsPrimary?: SystemIntakeGRBReviewDiscussionFragment[];
    grbDiscussionsInternal?: SystemIntakeGRBReviewDiscussionFragment[];
  } = {}
): MockedQuery<
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables
> => ({
  request: {
    query: GetSystemIntakeGRBDiscussionsDocument,
    variables: {
      id: systemIntake.id
    }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntake: {
        __typename: 'SystemIntake',
        id: systemIntake.id,
        grbDiscussionsInternal: data?.grbDiscussionsInternal || grbDiscussions,
        grbDiscussionsPrimary: data?.grbDiscussionsPrimary || grbDiscussions
      }
    }
  }
});
