import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSystemIntakeNote($input: UpdateSystemIntakeNoteInput!) {
    updateSystemIntakeNote(input: $input) {
      id
      content
    }
  }
`);
