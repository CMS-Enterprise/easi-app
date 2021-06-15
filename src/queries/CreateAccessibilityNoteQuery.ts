import { gql } from '@apollo/client';

export default gql`
  mutation CreateAccessibilityNote($input: CreateAccessibilityNoteInput!) {
    createAccessibilityNote(input: $input) {
      accessibilityNote {
        id
      }
    }
  }
`;
