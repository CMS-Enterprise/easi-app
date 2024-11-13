import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation SendTRBGuidanceLetter($input: SendTRBGuidanceLetterInput!) {
    sendTRBGuidanceLetter(input: $input) {
      id
    }
  }
`);
