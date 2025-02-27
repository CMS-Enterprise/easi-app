import { gql } from '@apollo/client';

export default gql`
  mutation DeleteCedarSystemBookmark($input: CreateCedarSystemBookmarkInput!) {
    deleteCedarSystemBookmark(input: $input) {
      cedarSystemId
    }
  }
`;
