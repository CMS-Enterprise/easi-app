import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment FundingSourceFragment on SystemIntakeFundingSource {
    id
    fundingNumber
    source
  }
`);
