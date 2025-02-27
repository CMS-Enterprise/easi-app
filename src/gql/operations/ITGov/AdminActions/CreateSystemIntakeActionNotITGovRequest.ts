import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionNotITGovRequest(
    $input: SystemIntakeNotITGovReqInput!
  ) {
    createSystemIntakeActionNotITGovRequest(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);
