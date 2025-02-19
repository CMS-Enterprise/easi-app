import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestDocuments($id: UUID!) {
    trbRequest(id: $id) {
      id
      documents {
        id
        fileName
        documentType {
          commonType
          otherTypeDescription
        }
        status
        uploadedAt
      }
    }
  }
`;
