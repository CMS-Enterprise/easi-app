import { gql } from '@apollo/client';

export default gql`
  query GetAdminNotesAndActions($id: UUID!) {
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
      actions {
        id
        createdAt
        feedback
        type
        actor {
          name
          email
        }
      }
    }
  }
`;
