import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation RequestReviewForTRBGuidanceLetter($id: UUID!) {
    requestReviewForTRBGuidanceLetter(id: $id) {
      id
    }
  }
`);
