import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTRBRequestFormStatus(
    $isSubmitted: Boolean!
    $trbRequestId: UUID!
  ) {
    updateTRBRequestForm(
      input: { isSubmitted: $isSubmitted, trbRequestId: $trbRequestId }
    ) {
      status
    }
  }
`);
