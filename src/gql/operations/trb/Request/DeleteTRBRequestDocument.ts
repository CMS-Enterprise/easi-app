import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteTRBRequestDocument($id: UUID!) {
    deleteTRBRequestDocument(id: $id) {
      document {
        fileName
      }
    }
  }
`);
