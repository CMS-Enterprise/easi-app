import { gql } from '@apollo/client';

export default gql`
  query GetTrbTasklist($id: UUID!) {
    trbRequest(id: $id) {
      type
      form {
        status
      }
    }
  }
`;
