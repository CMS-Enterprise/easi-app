import { gql } from '@apollo/client';

import SystemIntakeGRBReviewDiscussionPost from './SystemIntakeGRBReviewDiscussion';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewDiscussionPost}
  mutation CreateSystemIntakeGRBDiscussionPost(
    $input: createSystemIntakeGRBDiscussionPostInput!
  ) {
    createSystemIntakeGRBDiscussionPost(input: $input) {
      ...SystemIntakeGRBReviewDiscussionPost
    }
  }
`);
