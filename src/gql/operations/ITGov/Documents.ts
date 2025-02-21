import { gql } from '@apollo/client';

export const CreateSystemIntakeDocument = gql(/* GraphQL */ `
  mutation CreateSystemIntakeDocument(
    $input: CreateSystemIntakeDocumentInput!
  ) {
    createSystemIntakeDocument(input: $input) {
      document {
        ...SystemIntakeDocumentFragment
      }
    }
  }
`);

export const DeleteSystemIntakeDocument = gql(/* GraphQL */ `
  mutation DeleteSystemIntakeDocument($id: UUID!) {
    deleteSystemIntakeDocument(id: $id) {
      document {
        ...SystemIntakeDocumentFragment
      }
    }
  }
`);

export const GetSystemIntakeDocumentUrls = gql(/* GraphQL */ `
  query GetSystemIntakeDocumentUrls($id: UUID!) {
    systemIntake(id: $id) {
      id
      documents {
        id
        url
        fileName
      }
    }
  }
`);
