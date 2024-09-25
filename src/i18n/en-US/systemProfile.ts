const systemProfile = {
  header: 'CMS systems and applications',
  subHeader: 'Find information about existing CMS systems and applications.',
  newRequest: {
    info: 'Have a new system or application?',
    button: 'Start an intake request'
  },
  navigation: {
    home: 'System Home',
    details: 'Implementation details',
    detailsBasic: 'Basic details',
    detailsUrls: 'URLs and locations',
    detailsDev: 'Development',
    detailsIp: 'IP information',
    team: 'Team',
    contracts: 'Contracts',
    teamFte: 'FTE',
    teamBusinessOwners: 'Business Owner(s)',
    teamProjectLeads: 'Project lead(s)',
    teamAdditional: 'Additional team members',
    'funding-and-budget': 'Funding and Budget',
    'tools-and-software': 'Tools and Software',
    'ato-and-security': 'ATO and Security',
    ato: 'ATO',
    atoPoamsAndFindings: 'POA&Ms and findings',
    atoDatesFormsAndTesting: 'Dates, forms, and testing',
    'lifecycle-id': 'Lifecyle ID',
    'sub-systems': 'Sub-systems',
    'system-data': 'Data',
    documents: 'Documents'
  },
  tabs: {
    systemProfile: 'System Profile'
  },
  singleSystem: {
    id: 'single-system-profile',
    mainNavigation: 'Main Navigation',
    pointsOfContact: 'Point of contact',
    pointsOfContact_plural: 'Points of contact',
    noPointsOfContact:
      'This system does not have any points of contact identified.',
    noDataAvailable: 'No data available',
    sendEmail: 'Send an email',
    moreContact: 'More points of contact',
    description: {
      more: 'Read more',
      less: 'Read less'
    },
    noDescription: 'No system description available',
    summary: {
      back: 'Back to All systems',
      expand: 'Show system summary',
      hide: 'Hide system summary',
      label: 'Open system external link',
      view: 'View',
      subheader1: 'CMS component owner',
      subheader2: 'Business Owner',
      subheader2_plural: 'Business Owners',
      subheader3: 'Go live date',
      subheader4: 'Most recent major change release',
      goToWorkspace: 'Go to system workspace'
    },
    ato: {
      header: 'Authority to Operate (ATO)',
      status: 'Status',
      atoExpiringSoonLogicInfo:
        'Active ATOs will become Due Soon when they are 90 days away from their expiration',
      expirationDate: 'Expiration Date',
      effectiveDate: 'Effective Date',
      atoExpiration: 'ATO Expiration',
      securityAndPrivacy: {
        header: 'Security and privacy compliance at CMS',
        atoInfo:
          'Every information system operated by or on behalf of the U.S federal government is required to meet FISMA standards, which includes system authorization (ATO) signed by an Authoirizing Official (AO).',
        learnMoreAboutATO: 'Learn more about ATO',
        cfactsInfo:
          "CMS FISMA Continuous Tracking System (CFACTS) is a CMS database that tracks application security deficiencies and POA&Ms, and supports the ATO process. IT is the CMS governance, risk, and compliance tool used as a repository to manage CMS' information systems security and privacy requirements.",
        learnMoreAboutSecurityAndPrivacy:
          'Learn more about security and privacy at CMS'
      },
      methodologies: 'Methodologies and Programs',
      POAMandSecurityFindings:
        'Plan of Action and Milestones (POA&Ms) and security findings',
      totalPOAM: 'Total Open POA&Ms',
      longestOpenPOAM: 'Longest open POA&M',
      cfactsAccessInfo:
        "If you have access to CFACTS, you can go there to view additional information about your system's POA&Ms and security findings. If you do not have access, ask this system's ISSO for help accessing addtional information in CFACTS.",
      goToCfacts: 'Go to CFACTS',
      securityFindings: 'Security Findings',
      totalFindings: 'Total findings',
      criticalFindings: 'Critical findings',
      highFindings: 'High findings',
      moderateFindings: 'Medium findings',
      lowFindings: 'Low findings',
      notRatedFindings: 'Not Rated findings',
      datesFormsAndTesting: 'Dates, forms, and testing',
      lastPenTest: 'Last penetration test',
      lastPIA: 'Last PIA*',
      lastATOAssessment: 'Last ATO assessment',
      lastSIA: 'Last SIA*',
      lastDisasterRecoveryExercise: 'Last Disaster Recovery exercise',
      lastDisasterRecoveryPlanUpdate: 'Last Disaster Recovery Plan update',
      lastContingencyCompletion: 'Last Contengency Plan completion',
      lastActScaDate: 'Last ACT* or SCA*',
      documentType: 'Document',
      doesSystemHaveDoc: 'Does this sytem have one?',
      disasterRecoveryPlanDoc: 'Disaster Recovery Plan',
      sornDoc: 'SORN*',
      contingencyPlanDoc: 'Contingency Plan',
      acronymsDefined: '*Acronyms defined',
      acronymsFullList: 'Full list of security related acronyms',
      actAcronym: 'ACT: Adaptive Capabilities Testing',
      scaAcronym: 'SCA: Security Control Assessment',
      actScaLearnMore: 'Learn more about ACT and SCA',
      piaAcronym: 'PIA: Privacy Impact Assessment',
      piaLearnMore: 'Learn more about PIA',
      siaAcronym: 'SIA: Security Impact Analysis',
      siaLearnMore: 'Learn more about SIA',
      sornAcronym: 'SORN: System of Records Notice',
      sornLearnMore: 'Learn more about SORN',
      activityOwner: 'Activity owner',
      completed: 'Completed on ',
      due: 'Due ',
      noEmailContact: "Please contact this system's business owner.",
      noATODisclaimer:
        'There is no ATO on file for this system. If you believe this to be an error, please contact <link1>EnterpriseArchitecture@cms.hhs.gov</link1>',
      noATOPOAM:
        'Because there is no ATO on file for this system, there is no POAM information available. If you believe this to be an error, please contact',
      noATODates:
        'There is no information about previous tests or assessments available for this system',
      viewATOInfo: 'View ATO information'
    },
    contracts: {
      header: 'Contracts',
      contractInfo: 'Contract information',
      contractTitle: 'Contract title',
      isDeliveryOrg: 'Contract for Application Delivery Organization',
      vendors: 'Vendors',
      contractNumber: 'Contract number',
      taskOrderNumber: 'Task order number',
      periodOfPerformance: 'Period of performance',
      startDate: 'Start date',
      endDate: 'End date',
      contractServices: 'Contract services or functions',
      showMore: 'Show more contracts',
      showLess: 'Show less contracts',
      noContract: 'No contract title listed',
      noVendors: 'No vendors listed',
      noData: 'No data available',
      noContracts: 'This system does not have any contracts listed.'
    },
    fundingAndBudget: {
      header: 'Funding and Budget',
      budgetProjects: 'Budget Projects',
      noBudgetProjects: 'There are no budget projects listef for this system',
      fiscalYear: 'Fiscal Year',
      noFiscalYear: 'No fiscal year listed',
      actualSystemCost: 'Actual system cost',
      budgetedSystemCost: 'Budgeted system cost',
      percentageOfFunding: 'Percentage of funding dedicated to this system',
      noSystemCostInfo:
        'There is no system cost information available for this system',
      fundingSource: 'Funding Source',
      budgetID: 'Budget ID: ',
      noBudgetTitle: 'No budget title listed',
      systemFiscalYear: 'System fiscal year (FY) cost',
      viewMoreFunding: 'Show more budget projects',
      viewLessFunding: 'Show fewer budget projects'
    },
    team: {
      header: {
        fte: 'Full-time employees (FTE)',
        businessOwners: 'Business Owners',
        projectLeads: 'Project Leads',
        additional: 'Additional team members',
        contractInformation: 'Contract Information'
      },
      noData: {
        businessOwners:
          'There are no Business Owners identified for this system.',
        projectLeads: 'There are no Project Leads identified for this system.',
        additional:
          'There are no additional team members identified for this system.'
      },
      showMore: 'Show more points of contact',
      showLess: 'Show fewer points of contact',
      federalFte: 'Federal FTE',
      contractorFte: 'Contractor FTE',
      vendors: 'Vendors',
      contractAwardDate: 'Contract Award Date',
      periodOfPerformance: 'Period of performance',
      startDate: 'Start Date',
      endDate: 'End Date',
      contractNumber: 'Contract number',
      technologyFunctions: 'Technology functions',
      assetsOrServices: 'Assets or services',
      sendAnEmail: 'Send an email',
      totalEmployees: 'Total Full Time Employees (FTE)',
      viewMoreInfo: 'View more Team and Contract information',
      federalFTE: 'Federal FTE',
      contractorFTE: 'Contractor FTE'
    },
    editTeam: {
      systems: 'Systems',
      title: 'Edit System Profile: Team',
      description:
        'Add, remove, and edit the team members and roles for this system.',
      helpText:
        'All changes made here will be autosaved and applied to this system’s profile.',
      federalEmployees:
        'How many full-time federal employees work on this system?',
      contractors: 'How many full-time contractors work on this system?',
      teamMembers: 'Team members',
      addNewTeamMember: 'Add a new team member',
      currentTeamMembers: 'Current team members',
      editRoles: 'Edit roles',
      remove: 'Remove',
      removeTeamMember: 'Remove team member',
      removeModalTitle: 'Are you sure you want to remove  this team member?',
      removeModalDescription:
        'Removing {{commonName}} will also remove any roles they have for this system.',
      keepTeamMember: 'Keep team member',
      form: {
        add: {
          title: 'Add a team member',
          description:
            'Look up your team member and then add their role(s) on this team.',
          buttonLabel: 'Add this team member',
          returnButtonLabel:
            'Don’t add a team member and return to previous page'
        },
        edit: {
          title: 'Edit team member roles',
          description: 'Add or remove roles for this team member.',
          buttonLabel: 'Save changes',
          returnButtonLabel: 'Don’t edit roles and return to previous page'
        },
        name: 'Team member name',
        nameDescription:
          'Search by name. Looking up your team member will provide their name and email address.',
        nameError: 'Team member name is a required field',
        roles: 'Team member role(s)',
        rolesDescription:
          'Add or remove roles by clicking in the box below. You must select at least one role for this team member.',
        rolesError: 'You must select at least one role for this team member',
        selectedRoles: 'Selected roles',
        successUpdateRoles: 'Roles for {{commonName}} have been updated.',
        errorUpdateRoles:
          'There was a problem saving your changes. Please try again. If the error persists, please try again at a later date.',
        successAddContact: '{{commonName}} has been added as a team member.',
        errorAddContact:
          'There was a problem adding a team member. Please try again. If the error persists, please try again at a later date.',
        successRemoveContact:
          '{{commonName}} has been removed as a team member.',
        errorRemoveContact:
          'There was a problem removing a team member. Please try again. If the error persists, please try again at a later date.'
      }
    },
    editPage: {
      heading: 'Need to edit something on this page?',
      lastUpdated: 'Last updated: {{lastUpdatedText}}',
      buttonLabel: 'Edit {{page}}',
      tempEditBanner: {
        heading: 'See something incorrect on this page?',
        content:
          'To request edits to the information on this page, please email <1>EnterpriseArchitecture@cms.hhs.gov</1>'
      }
    },
    toolsAndSoftware: {
      header: 'Tools and Software',
      productCategory: 'Product Category',
      elaPurchase: 'Purchased under an Enterprise License Agreement',
      noManufacturerListed: 'No manufacturer listed',
      apiGateway: 'API Gateway',
      usedForAI: 'Used for Artificial Intelligence',
      noToolsOrSoftware:
        'This system does not have any tools or software listed.',
      viewMore: 'View {{count}} more software product',
      viewMore_plural: 'View {{count}} more software products',
      viewLess: 'View fewer software products'
    },
    systemData: {
      header: 'System data',
      enterpriseStatus: 'Enterprise Data Lake status',
      metadataGlossary: 'Metadata glossary',
      dataCategory: 'Data category',
      beneficiaryInfo:
        'Beneficiary information (address, email, mobile number)',
      pII: 'Personally Identifiable Information (PII)',
      pHI: 'Protected Health Information (PHI)',
      sensitiveInformation: 'Sensitive Information',
      dataUsedAnalyze: 'Data used to analyze beneficiary health disparities',
      bankingData: 'Banking data',
      collectedUsedStored: 'Collected, used, or stored?',
      recordCategories: 'Records management categories',
      apiInfo: 'API information',
      apiStatus: 'API status',
      fHIRUsage: 'FHIR Usage',
      apiDescriptionLocation: 'API description location',
      access: 'Access',
      apiPortal: 'API Portal',
      apiGateway: 'API Gateway',
      dataExchanges: 'Data exchanges',
      noExchangeTitle: 'No exchange title listed',
      noDescriptionAvailable: 'No description available',
      statusUnknown: 'Status unknown',
      readMore: 'Read more',
      readLess: 'Read less',
      sharedViaAPI: 'Shared via API',
      exchangeDirection: {
        receives: 'Receives data',
        sends: 'Sends data',
        unknown: 'Exchange direction unknown'
      },
      frequency: 'Frequency',
      numberOfRecords: 'Number of records',
      dataPartner: 'Data partner',
      informationExchangeAgreement: 'Information exchange agreement',
      showExchanges: {
        more: 'Show more data exchanges',
        less: 'Show fewer data exchanges'
      },
      noExchangesAlert: 'This system does not have any data exchanges listed.',
      recordsManagement: 'Records management',
      recordsSchedule: 'Records management schedule',
      recordsDisposal: 'Records disposal',
      persistentRecords: 'Persistent records',
      dataCategories: 'Data content categories',
      qualityAssurance: 'Quality Assurance',
      viewGateway: 'View gateway information',
      viewAPIInfo: 'View API information',
      viewDataExchange: 'View data exchange details',
      more: 'more'
    },
    systemDetails: {
      header: 'Basic details',
      ownership: 'System ownership',
      ownershipValues: {
        cmsOwned: 'CMS owned',
        contractorOwned: 'Contractor owned'
      },
      usersPerMonth: 'Users per month',
      access: 'Internal or public access',
      fismaID: 'FISMA Sytem ID',
      tagHeader1: 'CMS Programs and Mission Essential Functions',
      tagHeader2: 'CMS Innovation Center (CMMI) Models',
      urlsAndLocations: 'URLs and locations',
      showUrls: {
        less: 'Show fewer URLs',
        more: 'Show more URLs'
      },
      webApplicationFirewall: 'Web Application Firewall',
      migrationDate: 'Cloud migration date',
      noMigrationDate: 'No clould migration planned yet',
      environment: '{{environment}} environment',
      noEnvironmentListed: 'No environment listed',
      noUrlListed: 'No URL listed',
      provider: 'Location or cloud service provider name',
      location: 'Location',
      development: 'Development',
      customDevelopment: 'Custom Development',
      workCompleted: 'Development work completed',
      releaseFrequency: 'Planned release frequency',
      retirement: 'Planned retirement',
      developmentDescription: 'Description of development work to be completed',
      aiTechStatus: 'AI technology status',
      technologyTypes: 'AI Technology types',
      noURL: 'This system does not have any URLs or locations listed.',
      noEnvironmentURL: 'This environment does not have a URL.',

      ipInfo: 'IP Information',
      eCapInitiative: 'E-Cap Initiative',
      currentIP: 'Current front end access type',
      ipAssets: 'Number of IP-enabled assets',
      ipv6Transition: 'IPv6 transition',
      percentTransitioned: 'Percent transitioned to IPv6',
      hardCodedIP: 'Hard-coded IP addresses',

      moreURLs_nocount: 'View URLs',
      moreURLs: 'View {{count}} more URL',
      moreURLs_plural: 'View {{count}} more URLs'
    },
    subSystems: {
      header: 'Sub-systems',
      retirementDate: 'Retirement date',
      viewInfo: 'View sub-system information',
      noSystemDescription: 'No system description available',
      showSystems: {
        more: 'Show more sub-systems',
        less: 'Show fewer sub-systems'
      },
      noSubsystems:
        'This system does not have any sub-systems or child systems listed.'
    }
  },
  systemTable: {
    title: 'All CMS systems',
    mySystemsTitle: 'My systems',
    subtitle:
      'Click the bookmark icon (<icon />) to bookmark systems that you want to access more quickly.',
    jumpToSystems: 'Jump to all CMS systems',
    mySystemsSubtitle:
      'You are listed as a team member for the systems below. If you are listed in error, you may remove yourself from the team using the Team page of a System Profile. You may navigate to a System Profile using the links in the table below.',
    id: 'system-list',
    search: 'Search table',
    header: {
      openRequests: 'Open EASi requests',
      systemName: 'System name',
      systemOwner: 'CMS component',
      systemAcronym: 'Acronym',
      systemStatus: 'ATO status'
    },
    view: 'View',
    buttonGroup: {
      allSystems: 'All systems',
      mySystems: 'My systems',
      bookmarkedSystems: 'Bookmarked systems'
    },
    noMySystem: {
      header: 'You are not listed as a team member for any CMS systems',
      description:
        'If you believe this to be an error, please refresh the page. If the error persists, please contact <link1>EnterpriseArchitecture@cms.hhs.gov</link1>. If you wish to browse other CMS systems, use the Systems section of EASi to view information about all CMS systems.  <link2>Go to all CMS systems <iconForward /></link2>',
      descriptionAlt:
        'If you believe this to be an error, please refresh the page. If the error persists, please contact <link1>EnterpriseArchitecture@cms.hhs.gov</link1>.'
    },
    dontSeeSystem: {
      header: 'Don’t see the system you’re looking for?',
      description:
        'If you believe there’s an error in the table above, please refresh the page. You may also use the Systems section of EASi to view information about all CMS systems.  <link1>Go to all CMS systems<iconForward /></link1>'
    },
    atoStatusColumn: {
      Active: 'Expires',
      'Due Soon': 'Expires',
      Expired: 'Expired',
      'No ATO': 'No ATO on file'
    }
  },
  bookmark: {
    header: 'Bookmarked systems',
    subtitle: 'Bookmark systems that you want to access more quickly.',
    subHeader1: 'CMS Component',
    subHeader2: 'ATO Status',
    bookmark: 'Bookmark',
    bookmarked: 'Bookmarked'
  },
  noBookmark: {
    header: 'You have not bookmarked any systems yet.',
    text1: 'Click the bookmark icon ( ',
    text2: ' ) for any system to add it to this section.'
  },
  status: {
    success: 'Fully operational',
    warning: 'Degraded functionality',
    fail: 'Inoperative'
  },
  gql: {
    fail: 'Failed to retrieve systems data'
  },
  returnToSystemProfile: 'Return to system profile'
};

export default systemProfile;
