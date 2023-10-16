import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionChangeLcidRetirementDate(
    $input: SystemIntakeChangeLCIDRetirementDateInput!
  ) {
    createSystemIntakeActionChangeLCIDRetirementDate(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`;
