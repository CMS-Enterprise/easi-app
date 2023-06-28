import { gql } from '@apollo/client';

export const SystemIntakeDocument = gql`
  fragment SystemIntakeDocument on SystemIntakeDocument {
    documentType {
      commonType
      otherTypeDescription
    }
    id
    fileName
    status
    uploadedAt
    url
  }
`;

export const CreateSystemIntakeDocumentQuery = gql`
  ${SystemIntakeDocument}
  mutation CreateSystemIntakeDocument(
    $input: CreateSystemIntakeDocumentInput!
  ) {
    createSystemIntakeDocument(input: $input) {
      document {
        ...SystemIntakeDocument
      }
    }
  }
`;

export const DeleteSystemIntakeDocumentQuery = gql`
  ${SystemIntakeDocument}
  mutation DeleteSystemIntakeDocument($id: UUID!) {
    deleteSystemIntakeDocument(id: $id) {
      document {
        ...SystemIntakeDocument
      }
    }
  }
`;
