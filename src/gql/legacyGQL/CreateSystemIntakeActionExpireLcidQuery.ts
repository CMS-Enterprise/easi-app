import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionExpireLcid(
    $input: SystemIntakeExpireLCIDInput!
  ) {
    createSystemIntakeActionExpireLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`;
