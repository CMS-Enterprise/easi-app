import { gql } from '@apollo/client';

export default gql`
  mutation IssueLifecycleId($input: IssueLifecycleIdInput!) {
    issueLifecycleId(input: $input) {
      systemIntake {
        decisionNextSteps
        id
        lcid
        lcidExpiresAt
        lcidScope
      }
    }
  }
`;
