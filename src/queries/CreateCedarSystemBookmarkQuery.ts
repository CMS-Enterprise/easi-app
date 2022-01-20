import { gql } from '@apollo/client';

export default gql`
  mutation CreateCedarSystemBookmark($input: CreateCedarSystemBookmarkInput!) {
    createCedarSystemBookmark(input: $input) {
      cedarSystemBookmark {
        cedarSystemId
      }
    }
  }
`;
