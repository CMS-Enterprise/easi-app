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
    'team-and-contract': 'Team and Contract'
  },
  tabs: {
    systemProfile: 'System Profile'
  },
  singleSystem: {
    id: 'single-system-profile',
    summary: {
      expand: 'Expand system summary',
      hide: 'Hide system summary',
      label: 'Open system external link',
      view: 'View',
      subheader1: 'CMS Component',
      subheader2: 'Business Owner',
      subheader3: 'Go Live Date',
      subheader4: 'Most recent major change release'
    }
  },
  systemTable: {
    title: 'All Systems',
    subtitle: 'Bookmark systems that you want to access more quickly.',
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
