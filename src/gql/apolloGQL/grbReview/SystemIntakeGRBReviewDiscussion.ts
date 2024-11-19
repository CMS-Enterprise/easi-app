import { gql } from '@apollo/client';

const SystemIntakeGRBReviewDiscussionPost = gql(/* GraphQL */ `
  fragment SystemIntakeGRBReviewDiscussionPost on SystemIntakeGRBReviewDiscussionPost {
    id
    content {
      rawContent
    }
    votingRole
    grbRole
    createdByUserAccount {
      id
      commonName
    }
    systemIntakeID
    createdAt
  }
`);

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewDiscussionPost}
  fragment SystemIntakeGRBReviewDiscussion on SystemIntakeGRBReviewDiscussion {
    initialPost {
      ...SystemIntakeGRBReviewDiscussionPost
    }
    replies {
      ...SystemIntakeGRBReviewDiscussionPost
    }
  }
`);
