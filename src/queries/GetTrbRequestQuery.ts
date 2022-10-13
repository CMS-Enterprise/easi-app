import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequest($id: UUID!) {
    trbRequest(id: $id) {
      id
      name
      status
      createdAt
    }
  }
`;
