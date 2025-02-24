import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestDocumentUrls($id: UUID!) {
    trbRequest(id: $id) {
      id
      documents {
        id
        url
        fileName
      }
    }
  }
`;
