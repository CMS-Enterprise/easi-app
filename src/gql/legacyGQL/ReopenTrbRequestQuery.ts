import { gql } from '@apollo/client';

export default gql`
  mutation ReopenTrbRequest($input: ReopenTRBRequestInput!) {
    reopenTrbRequest(input: $input) {
      id
    }
  }
`;
