import { gql } from '@apollo/client';

export default gql`
  mutation CreateTestDate($input: CreateTestDateInput!) {
    createTestDate(input: $input) {
      testDate {
        id
      }
    }
  }
`;
