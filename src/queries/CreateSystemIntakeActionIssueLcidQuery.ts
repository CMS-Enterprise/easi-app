import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionIssueLcid(
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
