import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionGuideReceievedClose(
    $input: BasicActionInput!
  ) {
    createSystemIntakeActionGuideReceievedClose(input: $input) {
      systemIntake {
        status
        id
      }
    }
  }
`;
