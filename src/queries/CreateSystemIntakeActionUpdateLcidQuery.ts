import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionUpdateLcid(
    $input: SystemIntakeUpdateLCIDInput!
  ) {
    createSystemIntakeActionUpdateLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`;
