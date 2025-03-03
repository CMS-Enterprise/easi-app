import { gql } from '@apollo/client';
import SystemIntakeGRBReview from 'gql/operations/Fragments/SystemIntakeGRBReview';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReview}
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
