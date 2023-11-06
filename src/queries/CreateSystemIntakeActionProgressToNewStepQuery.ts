import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionProgressToNewStep(
    $input: SystemIntakeProgressToNewStepsInput!
  ) {
    createSystemIntakeActionProgressToNewStep(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;
