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
      isPiiLimitedToUserNameAndPass
    }
    exchanges(cedarSystemId: $cedarSystemId) {
      connectionFrequency
      containsHealthDisparityData
      containsPhi
      dataExchangeAgreement
      exchangeDescription
      exchangeDirection
      exchangeName
      id: exchangeId
      numOfRecords
      sharedViaApi
    }
    cedarBudget(cedarSystemID: $cedarSystemId) {
      fiscalYear
      funding
      fundingId
      fundingSource
      id
      name
      projectId
      projectTitle
      systemId
    }
    cedarBudgetSystemCost(cedarSystemID: $cedarSystemId) {
      budgetActualCost {
        actualSystemCost
        fiscalYear
        systemId
      }
    }
    cedarThreat(cedarSystemId: $cedarSystemId) {
      weaknessRiskLevel
    }
    cedarSoftwareProducts(cedarSystemId: $cedarSystemId) {
      aiSolnCatg
      aiSolnCatgOther
      apiDataArea
      apiDescPubLocation
      apiDescPublished
      apiFHIRUse
      apiFHIRUseOther
      apiHasPortal
      apisAccessibility
      apisDeveloped
      developmentStage
      softwareProducts {
        apiGatewayUse
        elaPurchase
        elaVendorId
        providesAiCapability
        refstr
        softwareCatagoryConnectionGuid
        softwareVendorConnectionGuid
        softwareCost
        softwareElaOrganization
        softwareName
        systemSoftwareConnectionGuid
        technopediaCategory
        technopediaID
        vendorName
      }
      systemHasAPIGateway
      usesAiTech
    }
    cedarContractsBySystem(cedarSystemId: $cedarSystemId) {
      id: systemID
      startDate
      endDate
      contractNumber
      contractName
      description
      orderNumber
      serviceProvided
      isDeliveryOrg
    }
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      businessOwnerInformation {
        isCmsOwned
        numberOfContractorFte
        numberOfFederalFte
        numberOfSupportedUsersPerMonth
        storesBeneficiaryAddress
        storesBankingData
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
        startDate
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
        ecapParticipation
        frontendAccessType
        hardCodedIPAddress
        ip6EnabledAssetPercent
        ip6TransitionPlan
        ipEnabledAssetCount
        netAccessibility
        plansToRetireReplace
        quarterToRetireReplace
        systemCustomization
        yearToRetireReplace
      }
    }
    cedarSubSystems(cedarSystemId: $cedarSystemId) {
      id
      name
      acronym
      description
    }
  }
`;
