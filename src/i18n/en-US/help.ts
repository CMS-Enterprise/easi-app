import { sendFeedbackOptions } from 'constants/helpFeedback';

const help = {
  heading: "We're here to help.",
  subheading:
    'Get assistance with your governance processes and requests, 508 testing, and system information.',
  threeOfTotalArticles: '3 of <1>{{totalArticles}}</1> articles',
  articleLinks: {
    allHelp: {
      copy: 'Browse all help articles',
      href: 'help/all-articles'
    },
    itGovernance: {
      copy: 'View IT Governance articles',
      href: 'help/it-governance'
    },
    section508: {
      copy: 'View Section 508 articles',
      href: 'help/section-508'
    },
    technicalReviewBoard: {
      copy: 'View TRB articles',
      href: 'help/trb'
    }
  },
  read: 'Read',
  relatedHelp: 'Related help articles',
  relatedDescription:
    'Below are some additional help articles that you may find useful.',
  needHelp: {
    heading: 'Need help?',
    content: 'Contact the Governance team:',
    email: 'IT_Governance@cms.hhs.gov'
  },
  back: 'Back',
  allHelpArticles: 'All help articles',
  itGovernance: {
    heading: 'IT Governance',
    subheading:
      'Get assistance with your governance processes and requests, such as adding a new system or service or completing a Business Case.'
  },
  section508: {
    heading: 'Section 508',
    subheading:
      'Get assistance with Section 508 processes and requirements, such as 508 testing. To learn more about Section 508, please visit ',
    website: 'www.section508.gov'
  },
  technicalReviewBoard: {
    heading: 'Technical Review Board',
    subheading:
      'Get technical help and guidance for your system, as well as support for any open requests.'
  },
  additionalContacts: {
    heading: 'Additional contacts',
    subheading:
      'Still need help? Use the contact information below to contact the group you need.',
    emailHeading: 'Email addresses',
    contacts: {
      govReview: {
        title: 'Governance Review Admin',
        type: 'IT Governance',
        content:
          'The Governance Review Admin team can help with questions related to your IT Governance requests.',
        email: 'IT_Governance@cms.hhs.gov'
      },
      section508: {
        title: 'Section 508',
        type: 'Section 508',
        content:
          'The Section 508 team can help with questions related to your 508 testing requests, including those about COTS and GOTS products.',
        email: 'CMS_Section508@cms.hhs.gov'
      },
      enterprise: {
        title: 'Enterprise Architecture',
        type: 'IT Governance',
        content:
          'The Enterprise Architecture team can help with questions related to your Enterprise Architecture needs.',
        email: 'EnterpriseArchitecture@cms.hhs.gov'
      },
      itNavigator: {
        title: 'IT Navigator',
        type: 'IT Governance',
        content:
          'The IT Navigator team can help with questions related to choosing the type of IT Governance request that fits your needs.',
        email: 'NavigatorInquiries@cms.hhs.gov'
      },
      technicalReviewBoard: {
        title: 'Technical Review Board (TRB)',
        type: 'Technical Review Board',
        content:
          'The TRB can help with any questions related to technical advice for your system, CMS Technical Reference Architecture (TRA), and more. ',
        email: 'cms-trb@cms.hhs.gov'
      }
    }
  },
  sendFeedback: {
    title: 'Send feedback',
    description:
      'Have a suggestion for how to improve EASi? Let us know using the form below.',
    closeTab: 'Close tab without sending feedback',
    labels: {
      isAnonymous: 'Would you like your feedback to remain anonymous?',
      canBeContacted:
        'May the EASi team contact you for additional information?',
      easiServicesUsed: 'Which EASi service were you using?',
      cmsRole: 'What is your role at CMS?',
      systemEasyToUse: 'The system was easy to use.',
      didntNeedHelpAnswering: 'I didn’t need help answering any questions.',
      questionsWereRelevant:
        'All the questions on the form were relevant to my use case.',
      hadAccessToInformation:
        'I had access to all the information the form asked for.',
      howSatisfied: 'Overall, how satisfied were you with the service?',
      howCanWeImprove: 'How can we improve EASi?',
      pleaseExplain: 'Please explain'
    },
    options: sendFeedbackOptions,
    descriptions: {
      isAnonymous:
        'If you select yes, your name and email will not be recorded with your feedback.'
    },
    errorMessage: {
      select: 'Please make a selection',
      explain: 'Please include an explanation',
      form: 'Please check and fix the form'
    },
    submit: 'Send feedback',
    done: {
      thankYou: 'Thank you for your feedback',
      willReview: 'The EASi team has received your report and will review it.',
      closeTab: 'Close tab and return to EASi',
      sendAnother: 'Send another report',
      reportProblem: 'Report a problem with EASi',
      sendFeedback: 'Send feedback for the EASi team'
    }
  },
  reportAProblem: {
    title: 'Report a problem',
    description:
      'Did you notice something wrong with EASi? Let us know using the form below.',
    labels: {
      whatWereYouDoing: 'What were you doing?',
      whatWentWrong: 'What went wrong?',
      howSevereWasTheProblem: 'How severe was this problem?'
    },
    submit: 'Send report'
  },
  footer: {
    wantToHelp: 'Want to help improve EASi?',
    reportProblem: 'Report a problem',
    sendFeedback: 'Send feedback',
    chatOnSlack: 'Chat with us on Slack'
  }
};

export default help;
