import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionIssueLCID(
    $input: SystemIntakeIssueLCIDInput!
  ) {
    createSystemIntakeActionIssueLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`;
