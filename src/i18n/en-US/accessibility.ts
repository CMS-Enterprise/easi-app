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
    remove: 'Remove this request from EASi'
  },
  testDateForm: {
    header: {
      create: 'Add a test date for {{requestName}}',
      update: 'Update a test date for {{requestName}}'
    },
    testTypeHeader: 'What type of test?',
    dateHeader: 'Test date',
    dateHelpText: 'For example: 4 28 2020',
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
  // TODO: move this to the above section?
  removeTestDate: {
    modalHeader:
      'Confirm you want to remove Test {{testNumber}} {{testType}}, {{testDate}} from {{requestName}}',
    modalText: 'This test date and score will be removed from the request page',
    modalRemoveButton: 'Remove test date',
    modalCancelButton: 'Keep test date',
    confirmation: '{{date}} test date was removed from {{requestName}} page'
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
    confirmation: '{{requestName}} was added to the 508 requests page'
  },
  documentType: {
    awardedVpat: 'Awarded VPAT',
    testingVpat: 'Testing VPAT',
    testPlan: 'Test plan',
    testResults: 'Test results',
    remediationPlan: 'Remediation plan',
    other: 'Other'
  }
};

export default accessibility;
