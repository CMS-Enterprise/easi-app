import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeNote($input: CreateSystemIntakeNoteInput!) {
    createSystemIntakeNote(input: $input) {
      id
      createdAt
      content
      author {
        name
        eua
      }
    }
  }
`;
