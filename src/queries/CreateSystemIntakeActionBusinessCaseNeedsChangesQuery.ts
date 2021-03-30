import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionBusinessCaseNeedsChanges(
    $input: BasicActionInput!
  ) {
    createSystemIntakeActionBusinessCaseNeedsChanges(input: $input) {
      systemIntake {
        status
        id
      }
    }
  }
`;
