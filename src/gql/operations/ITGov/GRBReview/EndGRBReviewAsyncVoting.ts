import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation EndGRBReviewAsyncVoting($systemIntakeID: UUID!) {
    manuallyEndSystemIntakeGRBReviewAsyncVoting(
      systemIntakeID: $systemIntakeID
    ) {
      systemIntake {
        ...SystemIntakeGRBReview
      }
    }
  }
`);
