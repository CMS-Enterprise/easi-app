import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation ExtendGRBReviewDeadlineAsync($input: ExtendGRBReviewDeadlineInput!) {
    extendGRBReviewDeadlineAsync(input: $input) {
      systemIntake {
        ...SystemIntakeGRBReview
      }
    }
  }
`);
