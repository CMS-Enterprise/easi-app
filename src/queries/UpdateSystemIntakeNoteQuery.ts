import { gql } from '@apollo/client';

export default gql`
  mutation UpdateSystemIntakeNote($input: UpdateSystemIntakeNoteInput!) {
    updateSystemIntakeNote(input: $input) {
      id
      content
    }
  }
`;
