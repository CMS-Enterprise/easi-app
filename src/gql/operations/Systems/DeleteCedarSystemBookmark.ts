import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteCedarSystemBookmark($input: CreateCedarSystemBookmarkInput!) {
    deleteCedarSystemBookmark(input: $input) {
      cedarSystemId
    }
  }
`);
