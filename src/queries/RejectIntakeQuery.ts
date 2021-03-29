import { gql } from '@apollo/client';

export default gql`
  mutation RejectIntake($input: RejectIntakeInput!) {
    rejectIntake(input: $input) {
      systemIntake {
        decisionNextSteps
        id
        rejectionReason
      }
    }
  }
`;
