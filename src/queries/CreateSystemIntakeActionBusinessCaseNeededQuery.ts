import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionBusinessCaseNeeded(
    $input: BasicActionInput!
  ) {
    createSystemIntakeActionBusinessCaseNeeded(input: $input) {
      systemIntake {
        status
        id
      }
    }
  }
`;
