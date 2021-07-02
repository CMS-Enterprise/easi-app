import { gql } from '@apollo/client';

export default gql`
  mutation CreateAccessibilityRequestNote(
    $input: CreateAccessibilityRequestNoteInput!
  ) {
    createAccessibilityRequestNote(input: $input) {
      accessibilityRequestNote {
        id
        note
        authorName
        requestID
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;
