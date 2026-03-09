import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemProfile($cedarSystemId: UUID!) {
    cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
      uuid
      countOfOpenPoams
      dateAuthorizationMemoExpires
      dateAuthorizationMemoSigned
      lastActScaDate
      lastAssessmentDate
      lastContingencyPlanCompletionDate
      lastPenTestDate
      oaStatus
      piaCompletionDate
      systemOfRecordsNotice
      tlcPhase
    }
    exchanges(cedarSystemId: $cedarSystemId) {
      connectionFrequency
      dataExchangeAgreement
      exchangeDescription
      exchangeDirection
      exchangeId
      exchangeName
      numOfRecords
      sharedViaApi
    }
    cedarBudget(cedarSystemID: $cedarSystemId) {
      fiscalYear
      funding
      fundingSource
      id
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
      daysOpen
      weaknessRiskLevel
    }
    cedarSoftwareProducts(cedarSystemId: $cedarSystemId) {
      apiDataArea
      apiDescPublished
      apiFHIRUse
      apiHasPortal
      apisAccessibility
      apisDeveloped
      softwareProducts {
        systemSoftwareConnectionGuid
        apiGatewayUse
        elaPurchase
        providesAiCapability
        softwareName
        technopediaCategory
        vendorName
      }
      systemHasAPIGateway
    }
    cedarContractsBySystem(cedarSystemId: $cedarSystemId) {
      systemID
      startDate
      endDate
      contractNumber
      contractName
      description
      orderNumber
      isDeliveryOrg
    }
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      isMySystem
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
        isBookmarked
        name
        description
        acronym
        status
        businessOwnerOrg
        businessOwnerOrgComp
        systemMaintainerOrg
        systemMaintainerOrgComp
        uuid
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
        ...CedarRoleFragment
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
`);
