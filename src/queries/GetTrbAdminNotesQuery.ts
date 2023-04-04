import { gql } from '@apollo/client';

export default gql`
  query GetTrbAdminNotes($id: UUID!) {
    trbRequest(id: $id) {
      id
      adminNotes {
        id
        isArchived
        category
        noteText
        author {
          commonName
        }
        createdAt
      }
    }
  }
`;
