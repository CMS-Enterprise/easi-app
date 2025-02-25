import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTRBForm($input: UpdateTRBRequestFormInput!) {
    updateTRBRequestForm(input: $input) {
      id
    }
  }
`);
