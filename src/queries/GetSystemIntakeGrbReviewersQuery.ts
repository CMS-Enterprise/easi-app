import { gql } from '@apollo/client';

export const SystemIntakeGrbReviewer = gql`
  fragment SystemIntakeGrbReviewer on SystemIntakeGRBReviewer {
    id
    grbRole
    votingRole
    userAccount {
      id
      username
      commonName
      email
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
