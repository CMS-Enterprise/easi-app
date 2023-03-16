import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTRBRequestFundingSources(
    $input: UpdateTRBRequestFundingSourcesInput!
  ) {
    updateTRBRequestFundingSources(input: $input) {
      source
      fundingNumber
      id
      createdAt
    }
  }
`;
