import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTrbRequestFormStatus(
    $isSubmitted: Boolean!
    $trbRequestId: UUID!
  ) {
    updateTRBRequestForm(
      input: { isSubmitted: $isSubmitted, trbRequestId: $trbRequestId }
    ) {
      status
    }
  }
`;
