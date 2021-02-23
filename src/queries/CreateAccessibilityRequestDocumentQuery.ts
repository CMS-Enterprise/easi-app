import { gql } from '@apollo/client';

export default gql`
  mutation CreateAccessibilityRequestDocument(
    $input: CreateAccessibilityRequestDocumentInput!
  ) {
    createAccessibilityRequestDocument(input: $input) {
      accessibilityRequestDocument {
        id
        mimeType
        name
        status
        uploadedAt
        requestID
      }
      userErrors {
        message
        path
      }
    }
  }
`;
