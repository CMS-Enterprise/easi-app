import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionExtendLifecycleId(
    $input: CreateSystemIntakeActionExtendLifecycleIdInput!
  ) {
    createSystemIntakeActionExtendLifecycleId(input: $input) {
      systemIntake {
        id
        lcidExpiresAt
      }
    }
  }
`;
