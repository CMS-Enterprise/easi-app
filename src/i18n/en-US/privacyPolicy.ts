const privacyPolicy = {
  mainTitle: 'Privacy',

  // CMS.gov Privacy Policy
  policy: {
    heading: 'CMS.gov Privacy Policy',

    info:
      'Protecting your privacy is very important to us. This privacy policy describes what information we collect, why we collect it, and what we do with it.  This privacy notice covers CMS.gov, marketplace.cms.gov, innovation.cms.gov, partnershipforpatients.cms.gov, and hfpp.cms.gov.  These websites are referred to as “CMS.gov” throughout the rest of this notice and are maintained and operated by the Centers for Medicare & Medicaid Services (CMS).  The privacy notice for other CMS websites not listed above is available at ',
    cmsPolicy:
      'https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/Privacy-Policy',

    collectionDescription:
      'CMS.gov doesn’t collect name, contact information, or other similar information through these websites unless you choose to provide it. We do collect other, limited, non-personally identifiable information automatically from visitors who read, browse, and/or download information from our website. We do this so we can understand how the website is being used and how we can make it more helpful. For more information, see ',

    personallyIdentifiableInfo:
      "Personally identifiable information (PII), defined by the Office of Management and Budget (OMB), refers to information that can be used to distinguish or trace an individual's identity, like their name, Medicare Number, biometric records, etc. alone, or when combined with other personal or identifying information which is linked or linkable to a specific individual, like date and place of birth, mother’s maiden name, etc. Medicare Fee-for-Service eligibility and enrollment information and claims data are considered protected health information (PHI) under the Health Insurance Portability and Accountability Act (1996) (HIPAA) regulations.",

    sellingInfo:
      'We don’t sell any information you provide when you visit CMS.gov. For information on how we share information, see ',
    infoUsage: 'How CMS uses information collected on CMS.gov'
  },

  // Types of information we collect
  infoWeCollect: {
    heading: 'Types of information we collect',

    // auto collect
    autoCollect: {
      heading: 'Information which is automatically collected:',
      whenYouBrowse: {
        heading: 'When you browse:',
        description:
          'Certain information about your visit can be collected when you browse websites. When you browse CMS.gov, we, and in some cases, our third-party service providers, can collect the following types of information about your visit, including:',

        infoList: [
          'Domain from which you accessed the internet (like Verizon.com if you’re using a Verizon account).',
          'IP address (an IP or internet protocol address is a number that’s automatically assigned to a device connected to the internet).',
          'Approximate geographic location based on the IP address of the user’s local system.',
          'Operating system for the device that you’re using and information about the browser you used when visiting the site. The operating system is software that directs a computer’s basic functions, like executing programs and managing storage.',
          'Date and time of your visit.',
          'Pages you visited.',
          'Address of the website that connected you to CMS.gov (like Google.com or Bing.com).',
          'Device type (like desktop computer, tablet, or type of mobile device).',
          'Screen resolution.',
          'Browser language.',
          'Geographic location.',
          'Time spent on page.',
          'Scroll depth (measures how much of a web page was viewed).',
          'Your actions on CMS.gov (like clicking a button).'
        ],

        moreInfo: 'For more information, see ',

        usageDescription: 'We use this information to:',
        usageList: [
          'Measure the number of visitors to CMS.gov.',
          'Help make our website more useful for visitors.',
          'Improve our public education and outreach through digital advertising.'
        ],

        additionalUsage:
          'Also, this information is sometimes used to personalize the content we show you on third-party sites. For more information on our practices, see '
      }
    },

    // provided
    provided: {
      heading: 'Information you may provide:',
      requested: {
        heading: 'When you request information:',

        whyWeCollect:
          'We collect information, including your email address, to deliver alerts or eNewsletters. We use this information to complete the subscription process and provide you with information. You can opt out of these communications at any time by editing your ',
        subscriptionPrefs: 'subscription preferences.'
      }
    }
  },

  // How CMS uses information collected on CMS.gov
  infoUsage: {
    heading: 'How CMS uses information collected on CMS.gov',

    // sending you messages
    sendingYouMessages: {
      heading: 'Sending you CMS messages:',
      description:
        'We use the email address you provide us to send emails related to CMS.'
    },

    // conducting surveys
    conductingSurveys: {
      heading: 'Conducting surveys to improve services:',
      description:
        'We use online surveys to collect opinions and feedback. You don’t have to answer these questions. If you do answer these questions, don’t include any PII/PHI in your answers. We analyze and use the information from these surveys to improve the CMS.gov website. The information is available only to CMS managers, members of the CMS communications and web teams, and other designated federal staff and contractors who require this information to perform their duties.'
    },

    // third party analytics
    thirdPartyAnalytics: {
      heading: 'Using third-party tools for website analytics',
      description:
        'We use a variety of third-party web tools for web analytics. We don’t collect any PII/PHI with these tools.  We use these tools to collect basic information about visits to CMS.gov. This information is then used to maintain the website, including:',
      usageList: [
        'Monitoring website stability',
        'Measuring website traffic',
        'Optimizing website content',
        'Helping make the website more useful to visitors'
      ],
      reports:
        'CMS staff analyzes the data collected from these tools. Reports are available only to CMS managers, teams who implement programs represented on CMS.gov, members of the CMS communications and web teams, and other designated federal staff and contractors who need this information to perform their jobs.'
    },

    // third party outreach
    thirdPartyOutreach: {
      heading:
        'Using third-party tools for outreach and education through digital advertising:',

      webServices:
        "We use third-party web services to conduct outreach and education through the use of digital advertising for CMS.gov. These third-party services may collect information through the use of web beacons (also called pixels) that are located on our pages. A web beacon is a see-through graphic image (usually 1 pixel x 1 pixel) that's placed on a web page and, in combination with a cookie, allows us to collect information regarding the use of the web page that contains the web beacon.",
      userTraffic:
        'We use web beacons to tell when a user is redirected to CMS.gov by clicking or otherwise interacting with a CMS advertisement that we ran on another website. This is known as “click tracking” or “conversion tracking,” and we use it to better target CMS advertisements (known as “retargeting”) to inform consumers about the services available through CMS.gov. For more information on how these tools work, see ',
      digitalAdvertising:
        "We also use third-party tools to help deliver advertising. Vendors that operate the third-party tools may also gather information about your visits to third-party sites outside of CMS.gov. While we don't track your internet activity outside of CMS.gov, our vendors may use information collected automatically by visiting CMS.gov, and combine it with data they collect elsewhere for targeted advertising purposes. You can opt out of this type of data collection via Privacy Manager, Ad Choices, and Do Not Track. For methods to opt out of this type of collection, see ",
      aggregateReports:
        'The outreach and education analytics tools provide reports which aggregate data like the number of clicks on advertisements. The reports are available only to CMS managers, teams who implement programs represented on CMS.gov, members of the CMS.gov communications and web teams, and other designated federal staff and contractors who need this information to perform their duties.'
    }
  },

  // How CMS uses cookies & other technologies on CMS.gov
  cookiesUsage: {
    heading: 'How CMS uses cookies & other technologies on CMS.gov',

    ombMemo: 'The Office of Management and Budget Memo ',
    memoName: 'M-10-22',
    guidance:
      ', Guidance for Online Use of Web Measurement and Customization Technologies, allows federal agencies to use session and persistent cookies to improve the delivery of services.',
    whatIsACookie:
      'When you visit a website, its server may generate a piece of text known as a “cookie” to place on your device. The cookie, which is unique to your browser, allows the server to "remember" specific information about your visit while you’re connected. The cookie makes it easier for you to use the dynamic features of web pages. Information that you enter into CMS.gov isn’t associated with cookies on CMS.gov. Depending on the third-party tool’s business practices, privacy policies, terms of service, and/or the privacy settings you selected, information you’ve provided to third parties could be used to identify you when you visit CMS.gov. These third parties don’t/won’t share your identity with CMS or the Department of Health and Human Services (HHS).',

    // types of cookies
    typesOfCookies:
      'There are 2 types of cookies - single session (temporary) and multi-session (persistent). Single session cookies last only as long as your internet browser is open. Once you close your browser, the session cookie disappears. Persistent cookies are stored on your device for longer periods. Both types of cookies create an ID that’s unique to your device.',
    cookies: {
      sessionCookies:
        '<0>Session cookies:</0> We use session cookies for technical purposes, like to allow better navigation through our website. These cookies let our server know that you’re continuing a visit to our website. The OMB Memo M-10-22 Guidance defines our use of session cookies as "Usage Tier 1—Single Session.” The policy says, "This tier encompasses any use of single session web measurement and customization technologies."',
      persistentCookies:
        '<0>Persistent cookies:</0> We use persistent cookies to understand the differences between new and returning visitors to CMS.gov. Persistent cookies remain on your device between visits to our website until they expire or are removed by the user. The OMB Memorandum M-10-22 Guidance defines our use of persistent cookies as "Usage Tier 2—Multi-session without personally identifiable information.” The policy says, "This tier encompasses any use of multi-session web measurement and customization technologies when no PII is collected." We don’t use persistent cookies to collect PII. We don’t identify a user by using cookies.'
    },

    // additional technology usage
    additionalTech: 'CMS also uses these technologies on CMS.gov:',
    additionalTechUsage: {
      persistentCookies:
        '<0>Persistent cookies for digital advertising:</0> Similar to persistent cookies identified above, CMS uses persistent cookies for outreach through digital advertising. These cookies can also be created on third-party websites and remain on your device between visits to our website until they expire or you remove them. Consistent with OMB guidance for “Usage Tier 2”, we don’t use persistent cookies for outreach to collect PII. CMS doesn’t identify a user by using such technologies.',
      webBeacons:
        '<0>Web beacons for digital advertising (also called pixels and/or tracking tags):</0> See-through images placed on certain pages of CMS.gov are typically used in conjunction with cookies and aren’t stored on your device. When you access these pages, web beacons generate a notice of your visit. For information on how we use web beacons, see',
      websiteLogFiles:
        '<0>Website log files:</0> These are used as an analysis tool and to tell how visitors use CMS.gov, how often they return, and how they navigate through the website.',
      flash:
        '<0>Flash:</0> Flash is used to assess the performance of the site and as a player for selected videos depending on the browser a device is using.',
      localStorageObjects:
        '<0>Local Storage Objects:</0> We use Flash Local Storage Objects (“LSOs”) to store your preferences and to personalize your visit.'
    }
  },

  // Your choices about tracking & data collection on CMS.gov
  tracking: {
    heading: 'Your choices about tracking & data collection on CMS.gov',
    trackingDescription: [
      'CMS.gov offers a Privacy Manager which gives you control over what tracking and data collection takes place during your visit. Third-party tools are enabled by default to provide a quality consumer experience.',
      'The Privacy Manager provides you with the choice to opt in or to opt out of the different categories of third-party tools used by CMS.gov: Advertising, Analytics, or Social Media. The Privacy Manager prevents cookies, web beacons, and Local Storage Objects from being placed on your device. The Privacy Manager also prevents third-party tools from loading regardless of your cookie settings, which provides you with an additional layer of privacy that prevents the tool from loading at all. Because the Privacy Manager creates a cookie in your browser, the opt in and opt out choices you make through the Privacy Manager will only be effective on the device and browser you used to make your choices, and your choices will expire when the cookie expires. Once the cookie is created, the Privacy Manager will retain your settings for 3 years from the date of your most recent visit. You may revisit the Privacy Manager to change or renew your choices at any time.',
      'If you disable cookies in your browser, our Privacy Manager won’t be able to store your preferences and won’t function properly. If you don’t wish to use our Privacy Manager to opt out of the tools used by CMS.gov, you can opt out of tools individually, or via the Digital Advertising Alliance (“DAA”) AdChoices icon, discussed in the next subsection.',
      'If you opt out of the tools used by CMS.gov via the Privacy Manager or by opting out of the tools directly, you’ll still have access to information and resources at CMS.gov.'
    ],

    adChoice:
      '<0>AdChoices:</0> We include the AdChoices icon on all digital advertising that uses “conversion tracking” or “retargeting.” To learn about conversion tracking, targeted advertising, and retargeting, see ',
    adChoiceIcon:
      '. The AdChoices icon is usually at or near the corner of digital ads. When you click on the AdChoices icon, it will provide information on what company served the ad and information on how to opt out. Learn more about AdChoices.',

    doNotTrack:
      '<0>Do Not Track:</0> We automatically observe the “Do Not Track” browser setting for digital advertising that uses “conversion tracking” or “retargeting.” If “Do Not Track” is set before a device visits CMS.gov, third-party conversion tracking and retargeting tools won’t load on the website. To learn more about conversion tracking and retargeting, see ',
    doNotTrackHelp:
      'Learn more about Do Not Track and how to set the Do Not Track setting in your browser.'
  },

  // How CMS uses third-party websites & applications with CMS.gov
  thirdParty: {
    heading: 'How CMS uses third-party websites & applications with CMS.gov',
    description:
      'CMS.gov uses a variety of technologies and social media services to communicate and interact with the public. These third-party websites and applications include popular social networking and media websites, open source software communities, and more.',

    // third party websites
    websites: {
      heading: 'Third-party websites:',
      activityGovernance:
        'Your activity on the third-party websites that CMS.gov links to (like Facebook or Twitter) is governed by the security and privacy policies of those websites. You should review the privacy policies of all websites before using them so you understand how your information may be used.'
    },

    // web analytics tools
    webAnalyticsTools: {
      heading: 'Website analytics tools:',

      informationCollection:
        'These tools collect basic site usage information, like:',
      collectionList: [
        'How many visits CMS.gov gets',
        'The pages visited',
        'Time spent on CMS.gov',
        'The number of return visits to CMS.gov',
        'The approximate geographic location of the device used to access CMS.gov',
        'Types of devices used'
      ],

      informationUsage:
        'This information is used to maintain the website, including:',
      usageList: [
        'Monitoring website stability',
        'Measuring website traffic',
        'Optimizing website content',
        'Improving your experience'
      ],

      optout:
        'Use the CMS.gov Privacy Manager to opt out of website analytics tools.'
    },

    // digital advertising
    digitalAdvertising: {
      heading: 'Digital advertising tools for outreach & education:',
      thirdPartyTools:
        'We use third-party tools to support our digital advertising outreach and education efforts. These tools enable us to reach new people and provide information to previous visitors. To use these tools, we use these technologies on CMS.gov:',
      clickTracking:
        '<0>Click tracking:</0> We use click tracking to identify the ads that are most helpful to consumers and efficient for outreach. This enables us to improve the performance of ads that consumers click on. When users click on links from ads, data about what ad was viewed is collected. Reports are generated about ad performance – including the total number of views and clicks an ad received.',
      conversionTracking:
        '<0>Conversion tracking:</0> We use conversion tracking to identify ads that are helpful to consumers and efficient for outreach. It enables us to improve the performance of ads viewed by consumers. When a CMS.gov ad is viewed on a third-party site (like a banner ad), a cookie is placed in the browser of the device the ad was viewed on. If this device later visits CMS.gov, the visit is linked to the ad viewed on the same device. Use the CMS.gov Privacy Manager to opt out of advertising tools. Users can click on the “AdChoices” icon in the corner of our ads to opt out of this Ad Targeting. Users who have set their browser to “Do Not Track” will automatically be opted out of conversion tracking. For more information about AdChoices and Do Not Track, see ',
      retargeting:
        "<0>Retargeting:</0> We use retargeting to provide information to consumers who have previously visited CMS.gov, like reminders about upcoming enrollment deadlines. Retargeting enables us to improve the performance of ads by delivering them to relevant audiences, like recent visitors to CMS.gov. During a visit to CMS.gov, a cookie is placed in the browser of the devices used to view the website. When that same device is used to visit third-party websites that are displaying CMS.gov ads, ads for CMS.gov may be shown to that device because it had previously visited CMS.gov. Using these cookies, we don't collect information about the third-party websites visited by a device. Reports are generated about ad performance – including the total number of views and clicks an ad received. Use the CMS.gov Privacy Manager to opt out of advertising tools. Users can click on the “AdChoices” icon in the corner of our ads to opt out of this Ad Targeting. Users who have set their browser to “Do Not Track” will automatically be opted out of conversion tracking. For more information about AdChoices and Do Not Track, see ",
      targetedAdvertising:
        '<0>Targeted advertising:</0> We use third-party vendors to engage in targeted advertising (also called online behavioral or interest-based advertising) to provide information to consumers across their online activities. Targeted advertising involves the collection of data from a particular computer or device. Data regarding web viewing behaviors or application use is gathered to predict user preferences or interests. We can have ads delivered to computers or devices based on the preferences or interests inferred from the web-viewing behaviors or application use.',
      vendors:
        'Third-party vendors engaged by us may also target advertising based on information automatically collected (not information you provide) when you browse our websites or other websites on the internet. You can opt out of this type of data collection via our Privacy Manager, Ad Choices, and Do Not Track. For methods to opt out of this type of collection, see ',
      vettingApps:
        "We may consider new third-party tools or the use of new third-party websites, but we'll first assess the tool or website before it’s used in connection with CMS.gov. We'll provide notice to the public before adding any new tool to CMS.gov. These assessments include a description about how information will be collected, accessed, secured, and stored. ",
      currentTools:
        'See a list of the third-party tools currently being used on CMS.gov.',
      riskAssessments:
        'See risk assessments for third-party websites and applications.'
    }
  },

  // How CMS protects your personal information
  personalInfo: {
    heading: 'How CMS protects your personal information',
    alertsOrNews:
      'You don’t have to give us personal information when you visit CMS.gov, but if you want to get alerts or e-newsletters, you’ll need to give us your email address to subscribe.',
    disclosure:
      'If you choose to give us PII in an email, request for information, paper or electronic form, questionnaire, survey, etc., we’ll the information you give us only long enough to respond to your question or to fulfill the stated purpose of the communication.',

    contact:
      'If we need to contact you, we’ll save your personal information in a record system designed to retrieve information about you by personal identifier (name, personal email address, home mailing address, personal or mobile phone number, etc.) and keep the information you give us safe according to the ',
    privacyAct: 'Privacy Act of 1974',
    amended: ', as amended ',
    USCSection552: '(5 U.S.C. Section 552a).',

    retrievalSystem:
      'If we have a record system to retrieve information about you so we can carry out our mission, a Privacy Act Notification Statement should be prominently displayed out in the open on the public-facing website or form asking you for PII. The statement has to address these 5 criteria:',

    criteriaList: [
      'The legal authorization we have to collect information about you',
      'Why we’re collecting information',
      'Routine ways we disclose information outside of our websites',
      'Whether or not you legally have to give us the information we’re asking for',
      'What happens if you choose to not us the information we’re asking for'
    ],

    additionalInformation:
      'For more information about CMS.gov’s privacy policy, email ',
    privacyEmail: 'Privacy@cms.hhs.gov',
    thirdPartyServices:
      'Third-party services are web-based technologies that aren’t exclusively operated or controlled by a government entity, or that involve significant participation of a nongovernment entity. These services may be separate websites or may be applications embedded within our websites. The list of third-party services includes links to relevant third-party privacy policies.'
  },

  // How long CMS keeps data & how it’s accessed
  dataLifecycle: {
    heading: 'How long CMS keeps data & how it’s accessed',
    destruction:
      "We'll keep data collected long enough to achieve the specified objective for which they were collected. Once the specified objective is achieved, the data will be retired or destroyed in accordance with published draft records schedules of CMS as approved by the National Archives and Records Administration.",
    storageDisclaimer:
      "We don't store information from cookies on our systems. The persistent cookies used with third-party tools on CMS.gov can be stored on a user’s local system and are set to expire at varying time periods depending upon the cookie. We assess whether the expiration date of a cookie exceeds one year and ",
    explanation: 'provides an explanation',
    longerLifecycle:
      ' as to why cookies with a longer life are used on the site in the associated Third-Party Website or Application Privacy Impact Assessment.'
  },

  // Children & Privacy on CMS.gov
  childPrivacy: {
    heading: 'Children & privacy on CMS.gov',
    description:
      'We believe it’s important to protect the privacy of children online. The Children’s Online Privacy Protection Act (COPPA) governs information gathered online from or about children under the age of 13. CMS.gov isn’t intended to solicit information of any kind from children under age 13.'
  },

  // Links to Other Sites
  linksToOtherSites: {
    heading: 'Links to other sites',
    description:
      'CMS.gov may link to other HHS websites, other government websites, and/or private organizations (like health care providers). We link to other websites solely for your convenience and education. When you follow a link to an external site, you’re leaving CMS.gov and the external site’s privacy and security policies will apply. Non-federal websites don’t necessarily operate under the same laws, regulations, and policies as federal websites. Other than third-party websites highlighted in this privacy notice, we aren’t responsible for the contents of external web pages and a link to a page doesn’t constitute an endorsement.',

    // social media
    socialMedia: {
      heading: 'Social media & other sites that require registration',
      usage: 'We use social media websites (listed below) to:',
      usageList: [
        'Increase government transparency',
        'Improve information sharing',
        'Promote public participation',
        'Encourage partnership with CMS'
      ],

      disclaimer:
        "<0>Social media websites aren’t government websites or applications. They’re controlled or operated by the social media website.</0> We don’t own, manage, or control social media websites. In addition, we don’t collect, maintain, or disseminate information posted by visitors to those social media websites. If you choose to provide information to a social media website through registration or other interaction with the website, the use of any information you provide is controlled by your relationship with the social media website. For example, any information that you provide to register on Facebook is voluntarily contributed and isn’t maintained by us. This information may be available to our social media page administrators in whole or part, based on a user's privacy settings on the social media website. However, we won’t use PII, if provided by you to a social media website or other website that requires registration, for targeted advertising or retargeting. Although you may voluntarily contribute to a social media website with the intent to share the information with others on a CMS social media page, to protect your privacy, don’t disclose PII about yourself or others.",
      infoStorage:
        'We don’t keep separate records or accounting of any social media website users or their interaction with the CMS.gov pages on social media websites. We don’t store or share this information. User information is retained by social media websites in accordance with the website’s policies. See each social media website’s privacy policy to see how long user information is retained after an account has been deleted. To learn more about how each social media website uses and maintains information visit their privacy policy, as follows:',

      facebook: 'Facebook',
      twitter: 'Twitter',
      youTube: 'YouTube',
      linkedIn: 'LinkedIn'
    }
  },

  // Additional Privacy Information
  additionalInformation: {
    heading: 'Additional privacy information',
    policies: 'Get more information about CMS privacy policies.'
  }
};

export default privacyPolicy;
