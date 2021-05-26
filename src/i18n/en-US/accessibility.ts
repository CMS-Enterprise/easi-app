// This is for the CMS 508 project flow

const accessibility = {
  documentTable: {
    caption: 'Documents uploaded for',
    header: {
      actions: 'Actions',
      documentName: 'Document',
      uploadedAt: 'Upload date'
    },
    remove: 'Remove',
    view: 'View',
    modal: {
      header: 'Confirm you want to remove {{name}}.',
      warning:
        'You will not be able to access this document after it is removed.',
      proceedButton: 'Remove document',
      declineButton: 'Keep document'
    }
  },
  requestTable: {
    caption: 'List of 508 requests',
    header: {
      requestName: 'Request Name',
      submissionDate: 'Submission Date',
      businessOwner: 'Business Owner',
      testDate: 'Test Date',
      pointOfContact: 'Point of Contact',
      status: 'Status'
    },
    lastUpdated: 'last updated on',
    emptyTestDate: 'Not Added'
  },
  tabs: {
    accessibilityRequests: '508 Requests'
  },
  requestDetails: {
    documents: {
      label: 'Documents',
      noDocs: {
        heading: 'Next step: Provide your documents',
        description:
          'Download and fill the VPAT and Test plan from the <1>templates page (opens in a new tab)</1>. The documents will help the 508 team know what to test and what criteria they should be looking for when testing.'
      }
    },
    documentUpload: 'Upload a document',
    other: 'Other request details',
    testingTemplates: '508 testing templates (opens in a new tab)',
    testingSteps: 'Steps involved in 508 testing (opens in a new tab)',
    remove: 'Remove this request from EASi',
    modal: {
      header: 'Confirm you want to remove {{-requestName}}',
      subhead:
        'You will not be able to access this request and its documents after it is removed.',
      confirm: 'Remove request',
      cancel: 'Keep request'
    },
    removeConfirmationText: '{{-requestName}} successfully removed'
  },
  testDateForm: {
    header: {
      create: 'Add a test date for {{-requestName}}',
      update: 'Update a test date for {{-requestName}}'
    },
    testTypeHeader: 'What type of test?',
    dateHeader: 'Test date',
    dateHelpText: 'For example: 4 28 2020',
    scoreHelpText: 'The test score must be a number between 0 and 100',
    scoreHeader: 'Does this test have a score?',
    scoreValueHeader: 'Test Score',
    scoreValueSRHelpText: 'Enter the test score without the percentage symbol',
    submitButton: {
      create: 'Add date',
      update: 'Update date'
    },
    cancel: "Don't add and go back to request page",
    confirmation: {
      date: 'Test date {{date}}',
      score: ' with score {{score}}%',
      create: ' was added',
      update: ' was updated'
    },
    inital: 'Initial',
    remediation: 'Remediation'
  },
  removeTestDate: {
    modalHeader:
      'Confirm you want to remove Test {{testNumber}} {{testType}}, {{testDate}} from {{-requestName}}',
    modalText: 'This test date and score will be removed from the request page',
    modalRemoveButton: 'Remove test date',
    modalCancelButton: 'Keep test date',
    confirmation: '{{date}} test date was removed from {{-requestName}} page'
  },
  newRequestForm: {
    heading: 'Request 508 testing',
    fields: {
      project: {
        label: 'Choose the project this request will belong to',
        header: "Choose the application you'd like to test",
        helpText: 'Start typing the name of the application or the Lifecycle ID'
      }
    },
    info:
      'A confirmation emil will be sent to you. After you send this request, you can upload your documents.',
    submitBtn: 'Send 508 testing request',
    confirmation:
      '508 testing request created. We have sent you a confirmation email.',
    surveyLink: 'Tell us what you think of this service (opens in a new tab)',
    helpAndGuidance: {
      lifecycleIdAccordion: {
        header: "What if I don't have a Lifecycle ID?",
        para:
          'A Lifecycle ID is your unique reference number that lets you operate your application. This ID is issued by the IT Governance team as a part of the GRT/GRB process. Contact the IT Governance team at ITgovernanceteam@cms.hhs.gov with information about your system.'
      }
    }
  },
  removeAccessibilityRequest: {
    reason: 'Reason for removal',
    INCORRECT_APPLICATION_AND_LIFECYCLE_ID:
      'Incorrect application and Lifecycle ID selected',
    NO_TESTING_NEEDED: 'No testing needed',
    OTHER: 'Other'
  },
  documentType: {
    awardedVpat: 'Awarded VPAT',
    testingVpat: 'Testing VPAT',
    testPlan: 'Test plan',
    testResults: 'Test results',
    remediationPlan: 'Remediation plan',
    other: 'Other'
  },
  testingStepsOverview: {
    heading: 'Steps involved in 508 testing',
    description:
      'Here is an overview of the 508 process for testing your application.',
    fillForm: {
      heading: 'Fill the request form in EASi',
      description: 'Tell the 508 team which application you plan to test.'
    },
    prepareVPAT: {
      heading: 'Prepare and upload the VPAT and Test plan',
      fillOutVPAT:
        'Download and fill the VPAT and Test plan from the <1>templates page (opens in a new tab)</1>. These documents will help the 508 team prepare for testing. Uploaded your completed documents to EASi for the 508 team to review.',
      changesVPAT:
        'The 508 team will get back to you via email about any changes needed prior to testing.'
    },
    testingSession: {
      heading: 'Attend the testing session',
      description:
        'The 508 team will work with you to schedule a testing session and you will test your application together. Depending on the results, you may need to address any issues and retest.'
    },
    results: {
      heading: 'Receive results',
      description: 'Your test score will determine your next steps:',
      score: {
        above99: {
          heading: '99% and above',
          description:
            '508 testing is complete and you can release your application.'
        },
        interval75: {
          heading: 'Between 99% and 75%',
          description:
            'You can release your application but you will need fix the issues and retest within a year. You need to submit a remediation plan as a part of retesting.'
        },
        below75: {
          heading: '75% and below',
          description:
            'You cannot release your application. You need to fix all issues right away and retest.'
        }
      }
    },
    exception: {
      label: 'What if I need an exception from 508 testing?',
      description:
        'On rare occasions, the Section 508 team may grant a testing exception for software, systems or applications. The reasons include:',
      reasons: [
        'National Security System',
        'Software/System acquired by a contractor, or incidental to a contract',
        'Undue Burden for CMS (e.g. - extreme cost)',
        'Fundamental alteration'
      ],
      exceptionFineprint:
        'Exceptions are only valid for one release. Future releases will be re-evaluated for additional exceptions.',
      contact:
        'To apply for an exception or for more information, contact the CMS Section 508 team at <1>CMS_Section508@cms.hhs.gov<1/>.'
    }
  },
  testingTemplates: {
    heading: 'Templates for 508 testing',
    vpatSection: {
      heading: 'Voluntary Product Assessment Template (VPAT)',
      description:
        'A VPAT is a document that helps CMS and other government agencies understand how you will meet the 508 Standards for IT accessibility.',
      subSection: {
        heading: 'Tips to complete a VPAT',
        item1: {
          text:
            'For each row in the table, indicate the conformance level. There are 5 levels:',
          levels: [
            {
              name: 'Supports:',
              description:
                'The functionality of the product has at least one method that meets the criterion without known defects or meets with equivalent facilitation.'
            },
            {
              name: 'Partially Supports:',
              description:
                'Some functionality of the product does not meet the criterion.'
            },
            {
              name: 'Does Not Support:',
              description:
                'The majority of product functionality does not meet the criterion.'
            },
            {
              name: 'Not Applicable:',
              description: 'The criterion is not relevant to the product.'
            },
            {
              name: 'Not Evaluated:',
              description:
                'The product has not been evaluated against the criterion. This can be used only in WCAG 2.0 Level AAA.'
            }
          ]
        },
        item2: {
          text:
            'After indicating the conformance level, provide a detailed explanation in the ‘Remarks and Evaluation’ column.'
        },
        downloadVPAT: {
          heading: 'Download VPAT template',
          line1: {
            linkText:
              'Download the current VPAT template (opens link in new tab)',
            otherText:
              'from the Information Technology Industry Council (ITI) website.'
          },
          line2: {
            text:
              'Do not skip any row in the document. This will result in delays.'
          },
          line3: {
            linkText:
              'Watch tutorial on how to fill out a VPAT (opens link a new tab).'
          }
        }
      }
    },
    testPlanSection: {
      heading: 'Test Plan',
      description:
        'The Test Plan is a document that helps the Section 508 team understand your system and know what areas of your system to test before it goes live. In this document you will provide:',
      itemsToProvide: [
        'a description of your system',
        'information on how to set up and access it',
        'user scenarios and steps taken to perform actions',
        'and any other constraints, assumptions or risks'
      ],
      download: {
        heading: 'Download Test Plan template',
        link: 'Download the Test Plan template as a MS Word doc'
      }
    },
    remediationPlanSection: {
      heading: 'Remediation Plan',
      description:
        'The Remediation Plan is a document that helps the Section 508 team understand how you plan to fix the issues that were identified from the 508 test. In this document you will provide:',
      itemsToProvide: [
        'solutions for each issue',
        'when and how you plan to schedule these changes into your project'
      ],
      download: {
        heading: 'Download Remediation Plan template',
        link: 'Download the Remediation Plan template as a MS Word doc'
      }
    }
  }
};

export default accessibility;
