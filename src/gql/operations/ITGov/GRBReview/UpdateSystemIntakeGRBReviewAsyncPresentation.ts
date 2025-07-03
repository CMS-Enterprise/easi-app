import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSystemIntakeGRBReviewAsyncPresentation(
    $links: SystemIntakeGRBPresentationLinksInput!
    $asyncRecordingDate: updateSystemIntakeGRBReviewFormInputPresentationAsync!
  ) {
    setSystemIntakeGRBPresentationLinks(input: $links) {
      createdAt
    }
    updateSystemIntakeGRBReviewFormPresentationAsync(
      input: $asyncRecordingDate
    ) {
      systemIntake {
        ...SystemIntakeGRBReview
      }
    }
  }
`);
