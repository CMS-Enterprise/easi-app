import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileDetails($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      businessOwnerInformation {
        isCmsOwned
        numberOfSupportedUsersPerMonth
      }
      systemMaintainerInformation {
        deploymentFrequency
        devCompletionPercent
        devWorkDescription
        netAccessibility
      }
    }
  }
`;
