import { gql } from '@apollo/client';

export default gql`
  mutation DeleteTestDate($input: DeleteTestDateInput!) {
    deleteTestDate(input: $input) {
      testDate {
        id
      }
    }
  }
`;
