import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionNotITGovRequest(
    $input: SystemIntakeNotITGovReqInput!
  ) {
    createSystemIntakeActionNotITGovRequest(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;
