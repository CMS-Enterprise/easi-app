const home = {
  title: 'Welcome to EASi',
  subtitle:
    'You can use EASi to go through the set of steps needed to get a Lifecycle ID from the Governance Review Board (GRB).',
  startNow: 'Start now',
  signIn: 'Sign in to start',
  accessibility: {
    heading: '508 Requests',
    newRequest: 'Add a new request'
  },
  actions: {
    itg: {
      heading: 'IT Governance',
      body:
        'Includes applying for a lifecycle ID, recompetes and decommissioning a system'
    },
    '508': {
      heading: 'Section 508 compliance',
      body:
        'Learn about the process and make a request for 508 testing of your application'
    }
  },
  requestsTable: {
    empty: 'Requests will display in a table once you add them',
    breadcrumb: {
      home: 'Home',
      table: 'My governance requests'
    },
    heading: 'My governance requests',
    headers: {
      name: 'Request name',
      type: 'Governance',
      submittedAt: 'Submission date',
      status: 'Status',
      nextMeetingDate: 'Upcoming meeting date'
    },
    types: {
      ACCESSIBILITY_REQUEST: 'Section 508',
      GOVERNANCE_REQUEST: 'IT Governance'
    },
    defaultName: 'Draft',
    defaultSubmittedAt: 'Not submitted',
    caption:
      'Below is a list of governance requests that are in draft or submitted.'
  },
  easiPurpose: 'You can use EASi to make:',
  easiTasks: [
    'IT Governance requests',
    '508 testing request for your application'
  ]
};

export default home;
