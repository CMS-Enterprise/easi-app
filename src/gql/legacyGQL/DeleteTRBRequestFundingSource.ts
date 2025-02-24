import { gql } from '@apollo/client';

export default gql`
  mutation DeleteTRBRequestFundingSource(
    $input: DeleteTRBRequestFundingSourcesInput!
  ) {
    deleteTRBRequestFundingSources(input: $input) {
      id
    }
  }
`;
