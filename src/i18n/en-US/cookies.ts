const cookies = {
  mainTitle: 'Cookies',

  // How CMS websites use information they collect
  informationUsage: {
    heading: 'How CMS websites use information they collect',
    tools:
      'CMS websites use a variety of Web measurement software tools. We use them to collect the information listed in the “Types of information collected” section in Privacy Policy. The tools collect information automatically and continuously. <0>No personally identifiable information is collected by these tools.</0>',
    analysis:
      'CMS website staff analyze and report on the collected data from these tools. The reports are available only to CMS website managers, members of the CMS websites communications and web teams, and other designated staff who need this information to perform their duties.',
    survey:
      "CMS websites may also use an online survey to collect opinions and feedback. This online survey appears on the bottom left of many pages on the site. You don't have to answer these questions. Please do not to include any personally identifiable information (PII) in comments you make. We analyze and use this information to improve the site's operation and content. The reports are available only to CMS website managers, members of the communications and Web teams, and other designated staff who require this information to perform their duties.",
    data:
      'CMS websites keep the data from our measurement tools as long as needed to support the mission of the website.'
  },

  // How CMS websites use cookies
  cookieUsage: {
    heading: 'How CMS websites use cookies',
    omBudgetMemo:
      'The Office of Management and Budget Memo M-10-22, Guidance for Online Use of Web Measurement and Customization Technologies, allows federal agencies to use session and persistent cookies.',
    generationOfCookies:
      'When you visit any website, its server may generate a piece of text known as a "cookie to place on your computer. The cookie allows the server to "remember" specific information about your visit while you are connected. The cookie makes it easier for you to use the dynamic features of Web pages. Cookies from CMS websites collect only information about your browser\'s visit to the site. They do not collect personal information about you.',
    typesOfCookies:
      'There are two types of cookies: single session (temporary) and multi-session (persistent). Session cookies last only as long as your Web browser is open. Once you close your browser, the cookie disappears. Persistent cookies are stored on your computer for longer periods.',

    sessionCookies: {
      label: 'Session Cookies:',
      info:
        'We use session cookies for technical purposes such as to allow better navigation through our site. These cookies let our server know that you are continuing a visit to our site. The OMB Memo 10-22 Guidance defines our use of session cookies as "Usage Tier 1: Single Session.” The policy says, "This tier encompasses any use of single session web measurement and customization technologies."'
    },
    persistentCookies: {
      label: 'Persistent Cookies:',
      info:
        'We use persistent cookies to understand the differences between new and returning CMS website visitors. Persistent cookies remain on your computer between visits to our site until they expire. The OMB Memo 10-22 Guidance defines our use of persistent cookies as "Usage Tier 2â€”Multi-session without Personally Identifiable Information (PII).â€ The policy says, "This tier encompasses any use of multi-session Web measurement and customization technologies when no PII is collected."'
    }
  },

  // How to opt out or disable cookies
  disableCookies: {
    heading: 'How to opt out or disable cookies',

    info:
      'If you do not wish to have session or persistent cookies placed on your computer, you can disable them using your Web browser. If you opt out of cookies, you will still have access to all information and resources on CMS websites. Instructions for disabling or opting out of cookies in the most popular browsers are located at ',
    howToLink: 'http://www.usa.gov/optout_instructions.shtml',
    notice:
      'Please note that by opting out of cookies, you will disable cookies from all sources, not just from CMS websites.'
  },

  // How we protect your personal information
  informationProtection: {
    heading: 'How we protect your personal information',

    informationStorage: [
      'You do not have to give us personal information to visit CMS websites. However, if you choose to receive alerts or e-newsletters, we collect your email address to complete the subscription process.',
      'If you choose to provide us with personally identifiable information through an email message, request for information, paper or electronic form, questionnaire, survey, etc., we will maintain the information you provide only as long as needed to respond to your question or to fulfill the stated purpose of the communication.',
      'If in order to contact you we store your personal information in a record system designed to retrieve information about you by personal identifier (name, personal email address, home mailing address, personal or mobile phone number, etc.), we will safeguard the information you provide in accordance with the Privacy Act of 1974, as amended (5 U.S.C. Section 552a).',
      'If any CMS website operates a record system designed to retrieve information about you in order to accomplish its mission, a Privacy Act Notification Statement should be prominently and conspicuously displayed on the public-facing website or form which asks you to provide personally identifiable information. The notice must address the following five criteria:'
    ],

    informationNoticeCriteriaList: [
      "The CMS website's legal authorization to collect information about you",
      'Purpose of the information collection',
      'Routine uses for disclosure of information outside of CMS websites',
      'Whether the request made of you is voluntary or mandatory under law',
      'Effects of non-disclosure if you choose to not provide the requested information'
    ],

    furtherInfo:
      'For further information about the CMS website privacy policy, please contact ',

    privacyEmail: 'Privacy@cms.hhs.gov'
  }
};

export default cookies;
