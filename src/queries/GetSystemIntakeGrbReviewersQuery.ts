import { gql } from '@apollo/client';

export const SystemIntakeGrbReviewer = gql`
  fragment SystemIntakeGrbReviewer on SystemIntakeGRBReviewer {
    id
    userAccount {
      id
      username
    }
  }
`;

export default gql`
  ${SystemIntakeGrbReviewer}
  query GetSystemIntakeGrbReviewers($id: UUID!) {
    systemIntake(id: $id) {
      id
      grbReviewers {
        ...SystemIntakeGrbReviewer
      }
    }
  }
`;
