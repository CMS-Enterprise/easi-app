import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation ReopenTRBRequest($input: ReopenTRBRequestInput!) {
    reopenTrbRequest(input: $input) {
      id
    }
  }
`);
