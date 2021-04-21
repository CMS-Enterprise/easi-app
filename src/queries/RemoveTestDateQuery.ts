import { gql } from '@apollo/client';

export default gql`
  mutation RemoveTestDate($input: RemoveTestDateInput!) {
    removeTestDate(input: $input) {
      testDate {
        id
      }
    }
  }
`;
