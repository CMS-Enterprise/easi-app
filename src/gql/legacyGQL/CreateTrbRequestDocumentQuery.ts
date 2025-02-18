import { gql } from '@apollo/client';

export default gql`
  mutation CreateTrbRequestDocument($input: CreateTRBRequestDocumentInput!) {
    createTRBRequestDocument(input: $input) {
      document {
        id
        documentType {
          commonType
          otherTypeDescription
        }
        fileName
      }
    }
  }
`;
