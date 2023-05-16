import { gql } from '@apollo/client';

export const CedarRole = gql`
  fragment CedarRole on CedarRole {
    application
    objectID
    roleTypeID
    assigneeType
    assigneeUsername
    assigneeEmail
    assigneeOrgID
    assigneeOrgName
    assigneeFirstName
    assigneeLastName
    roleTypeName
    roleID
  }
`;

export default gql`
  ${CedarRole}
  query GetSystemProfile($cedarSystemId: String!) {
    cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
      uuid
      tlcPhase
      dateAuthorizationMemoExpires
      countOfOpenPoams
      lastAssessmentDate
    }
    cedarThreat(cedarSystemId: $cedarSystemId) {
      weaknessRiskLevel
    }
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      businessOwnerInformation {
        isCmsOwned
        numberOfContractorFte
        numberOfFederalFte
        numberOfSupportedUsersPerMonth
      }
      cedarSystem {
        id
        name
        description
        acronym
        status
        businessOwnerOrg
        businessOwnerOrgComp
        systemMaintainerOrg
        systemMaintainerOrgComp
      }
      deployments {
        id
        dataCenter {
          name
        }
        deploymentType
        name
      }
      roles {
        ...CedarRole
      }
      urls {
        id
        address
        isAPIEndpoint
        isBehindWebApplicationFirewall
        isVersionCodeRepository
        urlHostingEnv
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
