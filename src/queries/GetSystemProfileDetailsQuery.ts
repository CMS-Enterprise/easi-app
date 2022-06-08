import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileDetails($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      businessOwnerInformation {
        isCmsOwned
        numberOfSupportedUsersPerMonth
      }
      cedarSystem {
        id
      }
      deployments {
        id
        dataCenter {
          name
        }
        deploymentType
        name
      }
      systemMaintainerInformation {
        agileUsed
        deploymentFrequency
        devCompletionPercent
        devWorkDescription
        netAccessibility
      }
      urls {
        id
        address
        isAPIEndpoint
        isBehindWebApplicationFirewall
        isVersionCodeRepository
        urlHostingEnv
      }
    }
  }
`;
