import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionProgressToNewStep(
    $input: SystemIntakeProgressToNewStepsInput!
  ) {
    createSystemIntakeActionProgressToNewStep(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);
