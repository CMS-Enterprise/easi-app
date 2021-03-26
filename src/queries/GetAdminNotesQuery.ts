import { gql } from '@apollo/client';

export default gql`
  query GetAdminNotes($id: UUID!) {
    systemIntake(id: $id) {
      notes {
        id
        createdAt
        content
        author {
          name
          eua
        }
      }
    }
  }
`;
