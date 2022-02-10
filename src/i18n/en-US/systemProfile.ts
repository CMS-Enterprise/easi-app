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
    'team-and-contract': 'Team and Contract',
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
    pointOfContact: 'Point of contact',
    sendEmail: 'Send and email',
    moreContact: 'More points of contact',
    summary: {
      back: 'Back to All Systems',
      expand: 'Expand system summary',
      hide: 'Hide system summary',
      label: 'Open system external link',
      view: 'View',
      subheader1: 'CMS Component',
      subheader2: 'Business Owner',
      subheader3: 'Go Live Date',
      subheader4: 'Most recent major change release'
    },
    systemDetails: {
      header: 'System Details',
      ownership: 'System ownership',
      usersPerMonth: 'Users per month',
      access: 'Internal or public access',
      fismaID: 'FISMA Sytem ID',
      tagHeader1: 'CMS Programs and Mission Essential Functions',
      tagHeader2: 'CMS Innovation Center (CMMI) Models',
      urlsAndLocations: 'URLs and Locations',
      migrationDate: 'Cloud migration date',
      noMigrationDate: 'No clould migration planned yet',
      location: 'Location',
      cloudProvider: 'Cloud Service Provider',
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
      hardCodedIP: 'Hard-coded IP addresses'
    },
    teamAndContract: {
      header: {
        teamAndContract: 'Team and Contract',
        contractInformation: 'Contract Information',
        pointsOfContact: 'Points of Contact'
      },
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
      sendAnEmail: 'Send an email'
    },
    fundingAndBudget: {
      header: 'Funding and Budget',
      actualFYCost: 'Actual FY system cost',
      budgetedFYCost: 'Budgeted FY system cost',
      investmentNumber: 'Investment number',
      requisitionNumber: 'Requisition number',
      tagHeader1: 'Funding Sources',
      budgetID: 'Budget ID: '
    },
    toolsAndSoftware: {
      header: 'Tools and Software',
      productType: 'Product Type',
      softwareVersion: 'Software version',
      softwareEdition: 'Software edition'
    }
  },
  systemTable: {
    title: 'All Systems',
    subtitle: 'Bookmark systems that you want to access more quickly.',
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
  }
};

export default systemProfile;
