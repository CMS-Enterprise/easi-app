const home = {
  title: 'Welcome, {{user}}',
  subtitle:
    'Use EASi to manage your systems, governance processes, security processes, and much more.',
  startNow: 'Start now',
  welcome: {
    title:
      '<span>Say hello to</span> <span>collaborative</span> <span><span>information</span> <span>management.</span></span></1>',
    intro:
      'Stay informed about your system’s TLC profile with situational governance and continuous compliance, using facilitated IT Governance processes powered by EASi.',
    toolsToHelp: {
      title: 'Tools to help:',
      list: [
        'Life Cycle ID management: request new IDs, manage existing ones, and keep your system in alignment with CMS investment guidelines',
        'Built-in technical assistance: feedback and guidance from SMEs and technical experts with compliance expertise',
        'A central location for your system information where anyone on your team can make updates and fix errors',
        'Access help resources to learn about and understand the Target Life Cycle (TLC)',
        'Learn more about other systems across CMS'
      ]
    },
    noMore: {
      title: 'No more:',
      list: [
        'Surprise Life Cycle ID expiration or searching everywhere for your Life Cycle ID',
        'Delaying releases due to compliance concerns and last-minute compliance questions',
        'Gate reviews',
        'Data calls',
        'Out-of-date system information'
      ]
    },
    futureFeatures: 'Future features',
    automation: 'Automation and trigger notifications',
    automationDescription:
      'Get notified when an ATO or Life Cycle ID for one of your systems is close to expiring or when you update system information that may trigger a review.',
    collaboration: 'Enhanced collaboration and multi-user access',
    collaborationDescription:
      'Collaborate with your team directly in EASi. Team leads can hand off tasks to team members, and multiple team members can collaborate on a single request.',
    editing: 'Additional system information editing',
    editingDescription:
      'Keep your system even more up to date with expanded system information. Share your System Profile with stakeholders and leadership.',
    capabilities: 'Capabilities and governance processes',
    lifecycleIds: 'Life Cycle IDs and IT Governance',
    lifecycleIdsDescription:
      'Request new Life Cycle IDs for your systems, amend existing ones, and get help decomissioning a system.',
    systemInformation: 'System information',
    systemInformationDescription:
      'Manage points of contact for your systems. Search for and find information about existing CMS systems and applications.',
    trb: 'Technical Review Board (TRB)',
    trbDescription:
      'Consult with SMEs and request help or feedback for your system, or ask the TRB for other technical assistance. '
  },
  signIn: 'Sign in to get started',
  accessibility: {
    heading: '508 Requests',
    newRequest: 'Add a new request'
  },
  actionTitle: 'Available services',
  actions: {
    ITGov: {
      heading: 'IT Governance',
      body:
        'Includes processes for applying for a Life Cycle ID and decomissioning a system.',
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
    empty:
      'You do not have any open requests in EASi. To start a new IT Governance request or technical assistance request, use the buttons above.',
    id: 'request-table',
    title: 'My open requests',
    subtitle:
      'You have access to edit and manage all of the requests below. You may have created them, or they may have been created by another team member',
    breadcrumb: {
      home: 'Home',
      table: 'My requests'
    },
    heading: 'Governance processes and other services',
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
    selectLabel: 'Select your admin view:',
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
        "From EASi's IT Governance home, you can review, assign, and manage incoming and existing IT Governance requests, as well as manage previously-issued Life Cycle IDs (LCIDs).",
      csvDownloadLabel: 'Download all IT Governance requests (csv)',
      downloadLabel: 'Download all {{status}} IT Governance requests (csv)',
      infoModal: {
        link: "What's included in the Portfolio Update Report?",
        heading: 'About the Portfolio Update Report',
        content:
          '<p>Downloading the Portfolio Update Report will generate and download a csv file of all IT Governance requests within the date range you select. The dates selected are based on the last admin note date.</p><p>The Report contains the following fields: Project name, Requester component, Last admin note, Project Manager name, Business Owner name, Business Owner component, Business need, Business solution, Process status, Funding source and number, Current annual spend, Planned annual spend, Contractor(s), Contract vehicle, Period of performance start, Period of performance end, Status, LCID scope, Admin lead, Updated at, and Submitted at.</p>'
      },
      configureReport: {
        button: 'Configure Portfolio Update Report',
        heading: 'Select a date range to download',
        content:
          'Portfolio Update Reports are based on the date of the last admin note. Select the date range of requests that you wish to download for this report.',
        rangeStart: 'Start of range',
        rangeEnd: 'End of range',
        download: 'Download',
        close: "Don't download and return to EASi",
        error: 'Please enter a valid date'
      }
    }
  }
};

export default home;
