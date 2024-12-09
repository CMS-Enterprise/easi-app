import { gql } from '@apollo/client';

import SystemIntakeGRBReviewDiscussionPost from './SystemIntakeGRBReviewDiscussion';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewDiscussionPost}
  mutation CreateSystemIntakeGRBDiscussionReply(
    $input: createSystemIntakeGRBDiscussionReplyInput!
  ) {
    createSystemIntakeGRBDiscussionReply(input: $input) {
      ...SystemIntakeGRBReviewDiscussionPost
    }
  }
`);
