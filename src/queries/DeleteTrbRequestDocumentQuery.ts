import { gql } from '@apollo/client';

export default gql`
  mutation DeleteTrbRequestDocument($id: UUID!) {
    deleteTRBRequestDocument(id: $id) {
      document {
        fileName
      }
    }
  }
`;
