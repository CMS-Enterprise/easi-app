import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSystemIntakeGRBReviewType(
    $input: updateSystemIntakeGRBReviewTypeInput!
  ) {
    updateSystemIntakeGRBReviewType(input: $input) {
      systemIntake {
        ...SystemIntakeGRBReview
      }
    }
  }
`);
