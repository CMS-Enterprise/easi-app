import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CloseTRBRequest($input: CloseTRBRequestInput!) {
    closeTRBRequest(input: $input) {
      id
    }
  }
`);
