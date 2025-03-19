import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSystemIntakeGRBReviewStandardPresentation(
    $presentationDeck: SystemIntakeGRBPresentationLinksInput!
    $grbMeetingDate: updateSystemIntakeGRBReviewFormInputPresentationStandard!
  ) {
    setSystemIntakeGRBPresentationLinks(input: $presentationDeck) {
      createdAt
    }
    updateSystemIntakeGRBReviewFormPresentationStandard(
      input: $grbMeetingDate
    ) {
      systemIntake {
        ...SystemIntakeGRBReview
      }
    }
  }
`);
