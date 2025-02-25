import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateCedarSystemBookmark($input: CreateCedarSystemBookmarkInput!) {
    createCedarSystemBookmark(input: $input) {
      cedarSystemBookmark {
        cedarSystemId
      }
    }
  }
`);
