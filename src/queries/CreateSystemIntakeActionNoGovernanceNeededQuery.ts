import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionNoGovernanceNeeded(
    $input: BasicActionInput!
  ) {
    createSystemIntakeActionNoGovernanceNeeded(input: $input) {
      systemIntake {
        status
        id
      }
    }
  }
`;
