import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionReadyForGRT($input: BasicActionInput!) {
    createSystemIntakeActionReadyForGRT(input: $input) {
      systemIntake {
        status
        id
      }
    }
  }
`;
