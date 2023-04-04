import { gql } from '@apollo/client';

export default gql`
  mutation CreateTrbAdminNote($input: CreateTRBAdminNoteInput!) {
    createTRBAdminNote(input: $input) {
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
`;
