export type HelpLinkType = {
  header: string;
  linkText: string;
  link: string;
  external?: boolean;
};

const helpLinks: HelpLinkType[] = [
  {
    header: 'Get a new Life Cycle ID (LCID)',
    link: '/system/request-type',
    linkText: 'Start an IT Governance request'
  },
  {
    header: 'Get technical assistance with your system',
    link: '/trb/start',
    linkText: 'Start a technical assistance request'
  },
  {
    header: 'Learn more about the Target Life Cycle (TLC)',
    link: 'https://www.cms.gov/data-research/cms-information-technology/tlc',
    linkText: 'Go to the TLC homepage',
    external: true
  },
  {
    header: 'Learn more about security and privacy at CMS',
    link: 'https://security.cms.gov/',
    linkText: 'Go to CyberGeek',
    external: true
  },
  {
    header: 'Consider Threat Modeling for your system',
    link: 'https://security.cms.gov/learn/threat-modeling',
    linkText: 'Learn more on CyberGeek',
    external: true
  },
  {
    header: 'Learn more about Cloud offerings at CMS',
    link: 'https://cloud.cms.gov/',
    linkText: 'Go to the Cloud homepage',
    external: true
  }
];

const systemWorkspace = {
  header: 'System workspace',
  subheader: 'for {{systemName}}',
  breadcrumbs: {
    home: 'Home'
  },
  tlcPhase: 'Overall Target Life Cycle (TLC) phase: ',
  bookmark: 'Bookmark',
  bookmarked: 'Bookmarked',
  returnToWorkspace: 'Return to system workspace',
  helpLinks: {
    header: 'How can EASi help you today?',
    description:
      'EASi can help point you towards documentation, available services, compliance processes, and other information that may help during your system’s life cycle. The links below may help you navigate OIT and other areas of CMS. ',
    links: helpLinks,
    showLinks: 'Show helpful links',
    hideLinks: 'Hide helpful links'
  },
  spaces: {
    header: 'Spaces',
    systemProfile: {
      header: 'System Profile',
      description:
        'Your System Profile compiles the information that CMS knows about your system and its status in the Target Life Cycle (TLC). Compiling more system information in EASi allows OIT and CMS to stay up-to-date about your system and proactively prompt you if there are any governance activities or TLC related tasks to complete.',
      linktext: 'View system profile'
    },
    ato: {
      header: 'Authority to Operate (ATO)',
      description:
        'Information systems that intend to operate for 3 years or more are required to get and maintain an ATO.',
      isso: 'Information System Security Officer (ISSO)',
      noIsso: 'This system has no ISSO',
      contact: 'Contact ISSO',
      cfacts: 'Go to CFACTs',
      learn: 'Learn more',
      modal: {
        header: 'Are you sure you want to leave EASi?',
        text: 'CFACTS requires additional job codes and/or permissions as well as connectivity via VPN in order to access content within the system.',
        continue: 'Continue to CFACTS',
        cancel: 'Go back to EASi'
      }
    },
    requests: {
      header: 'Requests in EASi',
      description:
        'EASi facilitates IT Governance requests and requests for technical assistance from the Technical Review Board (TRB).',
      start: 'Start a new request',
      itgCount: '{{count}} open IT Governance request',
      itgCount_plural: '{{count}} open IT Governance requests',
      trbCount: '{{count}} open technical assistance request',
      trbCount_plural: '{{count}} open technical assistance requests',
      viewAll: 'View all requests'
    },
    team: {
      header: 'Team',
      description:
        'Team members can edit all sections of a system workspace, including collaborating on IT Governance requests and adding more team members.',

      moreRolesCount: '+{{count}} more role',
      moreRolesCount_plural: '+{{count}} more roles',
      view: {
        more: 'View {{count}} more team members',
        less: 'View fewer team members'
      },
      add: 'Add a team member ',
      manage: 'Manage system team'
    }
  },
  requests: {
    header: 'Requests',
    subhead: 'for Easy Access to System Information',
    description:
      'EASi facilitates IT Governance requests and requests for technical assistance from the Technical Review Board (TRB). Use this page to view and manage open and closed requests for your system. You may have created them, or they may have been created by another team member.'
  }
};

export default systemWorkspace;
