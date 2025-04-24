import { gql } from '@apollo/client';

import SystemIntakeGRBReviewDiscussion from './SystemIntakeGRBReviewDiscussion';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewDiscussion}
  query GetSystemIntakeGRBDiscussions($id: UUID!) {
    systemIntake(id: $id) {
      id
      grbDiscussionsInternal {
        ...SystemIntakeGRBReviewDiscussion
      }
      grbDiscussionsPrimary {
        ...SystemIntakeGRBReviewDiscussion
      }
    }
  }
`);
