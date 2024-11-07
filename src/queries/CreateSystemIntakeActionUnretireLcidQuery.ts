import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionUnretireLcid(
    $input: SystemIntakeUnretireLCIDInput!
  ) {
    createSystemIntakeActionUnretireLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`;
