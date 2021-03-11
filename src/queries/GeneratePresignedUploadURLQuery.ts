import { gql } from '@apollo/client';

export default gql`
  mutation GeneratePresignedUploadURL(
    $input: GeneratePresignedUploadURLInput!
  ) {
    generatePresignedUploadURL(input: $input) {
      url
      userErrors {
        message
        path
      }
    }
  }
`;
