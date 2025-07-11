import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSystemIntakeGRBReviewFormInputTimeframeAsync(
    $input: updateSystemIntakeGRBReviewFormInputTimeframeAsync!
  ) {
    updateSystemIntakeGRBReviewFormTimeframeAsync(input: $input) {
      systemIntake {
        id
        grbReviewAsyncEndDate
      }
    }
  }
`);
