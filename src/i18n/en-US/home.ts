const home = {
  title: 'Welcome to EASi',
  subtitle:
    'The place to find CMS IT Governance, assistance with technical issues, Section 508 services, as well as comprehensive information about CMS systems.',
  startNow: 'Start now',
  signIn: 'Sign in to start',
  accessibility: {
    heading: '508 Requests',
    newRequest: 'Add a new request'
  },
  actionTitle: 'Available services',
  actions: {
    ITGov: {
      heading: 'IT Governance',
      body:
        'Includes processes for applying for a Lifecycle ID and decomissioning a system.',
      learnMore: 'Learn more about IT Governance',
      link: '/system/making-a-request',
      button: 'Start an IT Governance request',
      buttonLink: '/system/request-type'
    },
    '508': {
      heading: 'Section 508',
      body:
        'Request 508 testing for your application or system and learn about the process.',
      learnMore: 'Learn more about 508 testing',
      link: '/508/making-a-request',
      button: 'Start a 508 testing request',
      buttonLink: '/508/testing-overview?continue=true'
    },
    TRB: {
      heading: 'Technical Assistance',
      body:
        'Get help, feedback, and guidance from the Technical Review Board (TRB).',
      learnMore: 'Learn more about the TRB',
      link: '/trb',
      button: 'Start a TRB request',
      buttonLink: '/trb/start'
    }
  },
  requestsTable: {
    empty: 'Requests will display in a table once you add them',
    id: 'request-table',
    title: 'Request Table',
    breadcrumb: {
      home: 'Home',
      table: 'My requests'
    },
    heading: 'My requests',
    headers: {
      name: 'Request name',
      type: 'Governance',
      submittedAt: 'Submission date',
      status: 'Status',
      nextMeetingDate: 'Upcoming meeting date'
    },
    types: {
      ACCESSIBILITY_REQUEST: 'Section 508',
      GOVERNANCE_REQUEST: 'IT Governance',
      TRB: 'TRB'
    },
    defaultName: 'Draft',
    defaultSubmittedAt: 'Not submitted',
    caption:
      'Below is a list of governance requests that are in draft or submitted.'
  },
  easiIntro:
    'The place to find CMS IT Governance, assistance with technical issues, as well as comprehensive information about CMS systems.',
  easiPurpose: 'You can use EASi to make:',
  easiTasks: [
    'IT Governance requests, including those for Life Cycle IDs',
    'Technical assistance requests for your IT project'
  ],
  adminHome: {
    selectLabel: 'Select your admin view',
    TRB: {
      title: 'Technical assistance requests',
      label: 'TRB',
      description:
        "From EASi's TRB home, you can review, assign, and manage incoming and existing TRB support requests."
    },
    GRT: {
      title: 'IT Governance requests',
      label: 'IT Governance',
      description:
        "From EASi's IT Governance home, you can review, assign, and manage incoming and existing IT Governance requests, as well as manage previously-issued Life Cycle IDs (LCIDs)."
    }
  }
};

export default home;
