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
    linkText: 'Learn more',
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
      learn: 'Learn more'
    }
  }
};

export default systemWorkspace;
