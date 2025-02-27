import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionRetireLcid(
    $input: SystemIntakeRetireLCIDInput!
  ) {
    createSystemIntakeActionRetireLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`;
