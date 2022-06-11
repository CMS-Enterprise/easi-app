import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileDetails($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      businessOwnerInformation {
        isCmsOwned
        numberOfSupportedUsersPerMonth
      }
      systemMaintainerInformation {
        agileUsed
        deploymentFrequency
        devCompletionPercent
        devWorkDescription
        netAccessibility
      }
    }
  }
`;
