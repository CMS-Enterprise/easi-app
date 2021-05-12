import { gql } from '@apollo/client';

export const CreateAccessibilityRequestDocumentQuery = gql`
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

export const DeleteAccessibilityRequestDocumentQuery = gql`
  mutation DeleteAccessibilityRequestDocument(
    $input: DeleteAccessibilityRequestDocumentInput!
  ) {
    deleteAccessibilityRequestDocument(input: $input) {
      id
    }
  }
`;
