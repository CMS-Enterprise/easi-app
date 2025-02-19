import { gql } from '@apollo/client';

import SystemIntakeGRBReviewer from './SystemIntakeGRBReviewer';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewer}
  query GetSystemIntakeGRBReviewers($id: UUID!) {
    systemIntake(id: $id) {
      id
      grbReviewStartedAt
      grbReviewers {
        ...SystemIntakeGRBReviewer
      }
    }
  }
`);
