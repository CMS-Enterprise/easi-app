import { gql } from '@apollo/client';

import SystemIntakeGRBReviewer from './SystemIntakeGRBReviewer';

const GetSystemIntakeGRBReviewers = gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewer}
  query GetSystemIntakeGRBReviewers($id: UUID!) {
    systemIntake(id: $id) {
      id
      grbReviewers {
        ...SystemIntakeGRBReviewer
      }
    }
  }
`);

export default GetSystemIntakeGRBReviewers;
