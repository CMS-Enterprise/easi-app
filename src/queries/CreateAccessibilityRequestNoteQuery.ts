import { gql } from '@apollo/client';

export default gql`
  mutation CreateAccessibilityRequestNote(
    $input: CreateAccessibilityRequestNoteInput!
  ) {
    createAccessibilityRequestNote(input: $input) {
      accessibilityRequestNote {
        id
      }
    }
  }
`;
