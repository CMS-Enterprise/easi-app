import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSystemIntakeGRBReviewPresentation(
    $links: SystemIntakeGRBPresentationLinksInput!
    $reviewType: updateSystemIntakeGRBReviewTypeInput!
  ) {
    setSystemIntakeGRBPresentationLinks(input: $links) {
      createdAt
    }
    updateSystemIntakeGRBReviewType(input: $reviewType) {
      systemIntake {
        ...SystemIntakeGRBReview
      }
    }
  }
`);
