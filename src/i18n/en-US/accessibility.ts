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
      none: 'No documents added to this request yet.'
    },
    documentUpload: 'Upload a document',
    other: 'Other request details',
    remove: 'Remove this request from EASi',
    modal: {
      header: 'Confirm you want to remove {{-requestName}}?',
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
    }
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
    heading: 'Add a new request',
    fields: {
      project: {
        label: 'Choose the project this request will belong to'
      },
      businessOwnerName: {
        label: 'Business Owner Name',
        help:
          'The business owner name field will be automatically filled based on the project you choose'
      },
      businessOwnerComponent: {
        label: 'Business Owner Component',
        help:
          'The business owner component field will be automatically filled based on the project you choose'
      },
      requestName: {
        label: 'Request Name',
        help:
          'This name will be shown on the Active requests page. For example, ACME 1.3'
      }
    },
    info:
      'A request for 508 testing will be added to the list of 508 requests. An email will be sent to the Business Owner and the 508 team stating that a request has been added to the system.',
    submitBtn: 'Add a new request',
    confirmation: '{{-requestName}} was added to the 508 requests page'
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
    stepListHeading: 'Steps involved in 508 testing',
    fillForm: {
      heading: 'Fill the request form in EASi',
      description: 'Tell the 508 team which application you plan to test.'
    },
    prepareVPAT: {
      heading: 'Prepare and upload the VPAT and Test plan',
      fillOutVPAT:
        'Download and fill the VPAT and Test plan from the <1>templates page (opens in new tab)</1>. These documents will help the 508 team prepare for testing. Uploaded your completed documents to EASi for the 508 team to review.',
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
  }
};

export default accessibility;
