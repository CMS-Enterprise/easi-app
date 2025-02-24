import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestDocumentUrls($id: UUID!) {
    trbRequest(id: $id) {
      id
      documents {
        id
        url
        fileName
      }
    }
  }
`);
