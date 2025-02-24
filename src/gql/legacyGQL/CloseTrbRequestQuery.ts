import { gql } from '@apollo/client';

export default gql`
  mutation CloseTrbRequest($input: CloseTRBRequestInput!) {
    closeTRBRequest(input: $input) {
      id
    }
  }
`;
