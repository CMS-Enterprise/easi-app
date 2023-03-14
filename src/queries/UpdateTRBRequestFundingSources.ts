import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTRBRequestFundingSources(
    $trbRequestId: UUID!
    $sources: [String!]!
    $fundingNumber: String!
  ) {
    updateTRBRequestFundingSources(
      input: {
        sources: $sources
        fundingNumber: $fundingNumber
        trbRequestId: $trbRequestId
      }
    ) {
      source
      fundingNumber
      id
      createdAt
    }
  }
`;
