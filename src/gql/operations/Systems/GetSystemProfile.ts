import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemProfile($cedarSystemId: String!) {
    cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
      uuid
      actualDispositionDate
      containsPersonallyIdentifiableInformation
      countOfTotalNonPrivilegedUserPopulation
      countOfOpenPoams
      countOfTotalPrivilegedUserPopulation
      dateAuthorizationMemoExpires
      dateAuthorizationMemoSigned
      eAuthenticationLevel
      fips199OverallImpactRating
      fismaSystemAcronym
      fismaSystemName
      isAccessedByNonOrganizationalUsers
      isPiiLimitedToUserNameAndPass
      isProtectedHealthInformation
      lastActScaDate
      lastAssessmentDate
      lastContingencyPlanCompletionDate
      lastPenTestDate
      oaStatus
      piaCompletionDate
      primaryCyberRiskAdvisor
      privacySubjectMatterExpert
      recoveryPointObjective
      recoveryTimeObjective
      systemOfRecordsNotice
      tlcPhase
    }
    exchanges(cedarSystemId: $cedarSystemId) {
      connectionFrequency
      containsHealthDisparityData
      containsPhi
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
      daysOpen
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
      systemID
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
