import { gql } from '@apollo/client';

import SystemIntakeGRBReviewDiscussion from './SystemIntakeGRBReviewDiscussion';
import SystemIntakeGRBReviewer from './SystemIntakeGRBReviewer';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewer}
  ${SystemIntakeGRBReviewDiscussion}
  query GetSystemIntakeGRBReview($id: UUID!) {
    systemIntake(id: $id) {
      id
      grbReviewStartedAt
      grbReviewers {
        ...SystemIntakeGRBReviewer
      }
      grbDiscussions {
        ...SystemIntakeGRBReviewDiscussion
      }
    }
  }
`);
