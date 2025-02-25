import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSystemIntakeReviewDates(
    $input: UpdateSystemIntakeReviewDatesInput!
  ) {
    updateSystemIntakeReviewDates(input: $input) {
      systemIntake {
        id
        grbDate
        grtDate
      }
    }
  }
`);
