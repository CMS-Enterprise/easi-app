import {
  SystemIntakeGRBReviewDiscussionFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/gen/graphql';

const mockDiscussions = (
  systemIntakeID: string = '0d191c27-4de3-46d8-9ded-c2e9c6b3fbd6'
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
        commonName: 'Adeline Aarons'
      },
      systemIntakeID,
      createdAt: '2024-11-12T21:59:07.368862Z'
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
          commonName: 'Jerry Seinfeld'
        },
        systemIntakeID,
        createdAt: '2024-11-13T21:59:07.368862Z'
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
          commonName: 'Cosmo Kramer'
        },
        systemIntakeID,
        createdAt: '2024-11-13T21:59:07.368862Z'
      }
    ]
  }
];

export default mockDiscussions;
