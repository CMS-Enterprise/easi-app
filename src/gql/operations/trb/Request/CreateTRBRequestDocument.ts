import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateTRBRequestDocument($input: CreateTRBRequestDocumentInput!) {
    createTRBRequestDocument(input: $input) {
      document {
        id
        url
        documentType {
          commonType
          otherTypeDescription
        }
        fileName
      }
    }
  }
`);
