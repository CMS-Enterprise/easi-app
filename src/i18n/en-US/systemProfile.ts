const systemProfile = {
  header: 'CMS Systems and Applications',
  subHeader: 'Find information about existing CMS systems and applications.',
  newRequest: {
    info: 'Have a new system or application?',
    button: 'Start an intake request'
  },
  navigation: {
    home: 'System Home',
    details: 'System Details',
    team: 'Team',
    'funding-and-budget': 'Funding and Budget',
    'tools-and-software': 'Tools and Software',
    ato: 'ATO',
    'lifecycle-id': 'Lifecyle ID',
    'section-508': 'Section 508',
    'sub-systems': 'Sub-systems',
    'system-data': 'System Data',
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
    sendEmail: 'Send an email',
    moreContact: 'More points of contact',
    description: {
      more: 'Read more',
      less: 'Read less'
    },
    summary: {
      back: 'Back to All Systems',
      expand: 'Expand system summary',
      hide: 'Hide system summary',
      label: 'Open system external link',
      view: 'View',
      subheader1: 'CMS Component',
      subheader2: 'Business Owner',
      subheader2_plural: 'Business Owners',
      subheader3: 'Go Live Date',
      subheader4: 'Most recent major change release'
    },
    ato: {
      header: 'Authority to Operate (ATO)',
      status: 'Status',
      expiration: 'Expiration Date',
      atoExpiration: 'ATO Expiration',
      currentActivity: 'Current activity',
      methodologies: 'Methodologies and Programs',
      POAM: 'Plan of Action and Milestones (POAMs)',
      totalPOAM: 'Total POAMs',
      highPOAM: 'High POAMs',
      cfactsInfo:
        'CFACTS is the CMS system that stores and manages security information for systems. If you have access to CFACTS, you can view additional information about POAMs and security findings for you system.',
      viewPOAMs: 'View POAMs in CFACTS',
      securityFindings: 'Security Findings',
      totalFindings: 'Total findings',
      criticalFindings: 'Critical findings',
      highFindings: 'High findings',
      moderateFindings: 'Medium findings',
      lowFindings: 'Low findings',
      notRatedFindings: 'Not Rated findings',
      viewFindings: 'View findings in CFACTS',
      datesAndTests: 'Dates and Tests',
      lastTest: 'Last penetration test',
      lastAssessment: 'Last assessment',
      contingencyCompletion: 'Contengency Plan completion',
      contingencyTest: 'Contengency Plan test',
      securityReview: 'System Security Plan review',
      authorizationExpiration: 'Authorization memo expiration',
      piaCompletion: 'PIA completion',
      sornCompletion: 'SORN completion',
      lastSCA: 'Last SCA/CDM',
      activityOwner: 'Activity owner',
      completed: 'Completed on ',
      due: 'Due ',
      noEmailContact: "Please contact this system's business owner.",
      noATO:
        'There is no ATO on file for this system. If you believe this to be an error, please contact',
      noATOPOAM:
        'Because there is no ATO on file for this system, there is no POAM information available. If you believe this to be an error, please contact',
      noATODates:
        'There is no information about previous tests or assessments available for this system',
      viewATOInfo: 'View ATO information'
    },
    fundingAndBudget: {
      header: 'Funding and Budget',
      actualFYCost: 'Actual FY system cost',
      budgetedFYCost: 'Budgeted FY system cost',
      investmentNumber: 'Investment number',
      requisitionNumber: 'Requisition number',
      tagHeader1: 'Funding Sources',
      budgetID: 'Budget ID: ',
      systemFiscalYear: 'System fiscal year (FY) cost',
      viewMoreFunding: 'View more funding and budget information'
    },
    team: {
      header: {
        team: 'Team',
        businessOwners: 'Business Owners',
        projectLeads: 'Project Leads',
        additional: 'Additional Points of Contact'
      },
      noData: {
        businessOwners:
          'This system does not have any Business Owners identified.',
        projectLeads: 'This system does not have any Project Leads identified.',
        additional: 'This system has no additional points of contact.'
      },
      viewMore: 'View {{count}} more contact',
      viewMore_plural: 'View {{count}} more contacts',
      viewLess: 'View fewer contacts',
      federalFullTimeEmployees: 'Federal Full Time Employees',
      contractorFullTimeEmployees: 'Contractor Full Time Employees',
      vendors: 'Vendors',
      contractAwardDate: 'Contract Award Date',
      periodOfPerformance: 'Period of performance',
      startDate: 'Start Date',
      endDate: 'End Date',
      contractNumber: 'Contract number',
      technologyFunctions: 'Technology functions',
      assetsOrServices: 'Assets or services',
      pointOfContact: 'Point of contact',
      sendAnEmail: 'Send an email',
      totalEmployees: 'Total Full Time Employees (FTE)',
      viewMoreInfo: 'View more Team and Contract information',
      federalFTE: 'Federal FTE',
      contractorFTE: 'Contractor FTE'
    },
    editTeam: {
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
      removeTeamMember: 'Remove team member',
      form: {
        addTeamMember: 'Add a team member',
        addDescription:
          'Look up your team member and then add their role(s) on this team.'
      }
    },
    toolsAndSoftware: {
      header: 'Tools and Software',
      productType: 'Product Type',
      softwareVersion: 'Software version',
      softwareEdition: 'Software edition'
    },
    systemData: {
      header: 'System Data',
      recordCategories: 'Records management categories',
      beneficiariesAddress: 'Beneficiary addresses',
      pII: 'Personally Identifiable Information (PII)',
      pHI: 'Protected Health Information (PHI)',
      apiInfo: 'API Information',
      apiStatus: 'API status',
      fHIRUsage: 'FHIR Useage',
      apiGateway: 'API Gateway',
      access: 'Access',
      dataCategories: 'Data content categories',
      dataExchanges: 'Data Exchanges',
      dataPartner: 'Data Partner',
      qualityAssurance: 'Quality Assurance',
      viewGateway: 'View gateway information',
      viewAPIInfo: 'View API information',
      viewDataExchange: 'View data exchange details',
      more: 'more'
    },
    systemDetails: {
      header: 'System Details',
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
      urlsAndLocations: 'URLs and Locations',
      webApplicationFirewall: 'Web Application Firewall',
      migrationDate: 'Cloud migration date',
      noMigrationDate: 'No clould migration planned yet',
      environment: 'environment',
      provider: 'Data Center/Cloud Service Provider name',
      location: 'Location',
      development: 'Development',
      customDevelopment: 'Custom Development',
      workCompleted: 'Development work completed',
      releaseFrequency: 'Planned release frequency',
      retirement: 'Planned retirement',
      developmentDescription: 'Description of development work to be completed',
      aiTechStatus: 'AI technology status',
      technologyTypes: 'AI Technology types',
      noURL: 'This system does not have URLS',
      noEnvironmentURL: 'This environment does not have a url',
      ipInfo: 'IP Information',
      currentIP: 'Current IP access',
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
      viewInfo: 'View sub-system information'
    },
    section508: {
      section508RequestName: '508 request name',
      viewMoreRequestInformation: 'View more 508 request information',
      openRequests: 'Open 508 testing requests',
      closedRequests: 'Closed testing requests',
      testingDocuments: '508 testing documents',
      requestName: 'Request name',
      currentStatus: 'Current status',
      statusChanged: 'Request status changed',
      test: 'test',
      latestTest: 'Latest test',
      initialTest: 'Initial Test:',
      score: 'Score:',
      businessOwner: 'Business owner',
      submissionDate: 'Submission date',
      uploadedDocuments: 'uploaded documents',
      viewUploadedDocuments: 'View uploaded documents',
      startNewRequest: 'Start a new 508 testing request',
      viewMostRecent: 'View most recent',
      uploaded: 'Uploaded',
      additional: 'Additional',
      table: {
        document: 'Document',
        uploadDate: 'Upload Date',
        actions: 'Actions',
        view: 'View'
      }
    }
  },
  systemTable: {
    title: 'All Systems',
    subtitle: 'Bookmark systems that you want to access more quickly.',
    noResults: 'No systems found.',
    id: 'system-list',
    search: 'Search Table',
    header: {
      systemName: 'System Name',
      systemOwner: 'CMS Component',
      systemAcronym: 'Acronym',
      systemStatus: 'ATO Status'
    }
  },
  bookmark: {
    header: 'Bookmarked Systems',
    subtitle: 'Bookmark systems that you want to access more quickly.',
    subHeader1: 'CMS Component',
    subHeader2: 'ATO Status'
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
