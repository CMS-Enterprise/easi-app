import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteTRBRequestFundingSource(
    $input: DeleteTRBRequestFundingSourcesInput!
  ) {
    deleteTRBRequestFundingSources(input: $input) {
      id
    }
  }
`);
