import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTrbForm($input: UpdateTRBRequestFormInput!) {
    updateTRBRequestForm(input: $input) {
      id
    }
  }
`;
