import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestDocuments($id: UUID!) {
    trbRequest(id: $id) {
      id
      documents {
        id
        fileName
        url
        documentType {
          commonType
          otherTypeDescription
        }
        status
        uploadedAt
      }
    }
  }
`);
