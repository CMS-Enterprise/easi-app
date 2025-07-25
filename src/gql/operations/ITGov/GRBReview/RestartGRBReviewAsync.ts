import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation RestartGRBReviewAsync($input: RestartGRBReviewInput!) {
    restartGRBReviewAsync(input: $input) {
      systemIntake {
        ...SystemIntakeGRBReview
      }
    }
  }
`);
