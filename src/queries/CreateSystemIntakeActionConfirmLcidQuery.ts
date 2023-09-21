import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionConfirmLcid(
    $input: SystemIntakeConfirmLCIDInput!
  ) {
    createSystemIntakeActionConfirmLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`;
