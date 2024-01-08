import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionSendEmail($input: BasicActionInput!) {
    createSystemIntakeActionSendEmail(input: $input) {
      systemIntake {
        status
        id
      }
    }
  }
`;
