import { gql } from '@apollo/client';

import SystemIntakeGRBReviewer from './SystemIntakeGRBReviewer';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewer}
  query GetSystemIntakeGRBReview($id: UUID!) {
    systemIntake(id: $id) {
      id
      grbReviewStartedAt
      grbReviewers {
        ...SystemIntakeGRBReviewer
      }
    }
  }
`);
