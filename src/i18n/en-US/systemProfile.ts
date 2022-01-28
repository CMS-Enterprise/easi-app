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
    pointOfContact: 'Point of Contact',
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
      prodEnv: 'Production environment',
      wedAppFirewall: 'Web Application Firewall',
      location: 'Location',
      cloudProvider: 'Cloud Service Provider'
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
