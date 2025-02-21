import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTrbForm($input: UpdateTRBRequestFormInput!) {
    updateTRBRequestForm(input: $input) {
      id
    }
  }
`);
