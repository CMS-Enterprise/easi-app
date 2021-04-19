import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTestDate($input: UpdateTestDateInput!) {
    updateTestDate(input: $input) {
      testDate {
        id
      }
    }
  }
`;
