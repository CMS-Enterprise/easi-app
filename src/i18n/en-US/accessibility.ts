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
    view: 'View'
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
  createTestDate: {
    addTestDateHeader: 'Add a test date for {{requestName}}',
    testTypeHeader: 'What type of test?',
    dateHeader: 'Test date',
    dateHelpText: 'For example: 4 28 2020',
    scoreHeader: 'Does this test have a score?',
    scoreValueHeader: 'Test Score',
    scoreValueSRHelpText: 'Enter the test score without the percentage symbol',
    submitButton: 'Add date',
    cancel: "Don't add and go back to request page",
    confirmation: 'Test date {{date}} added to {{requestName}} page'
  },
  updateTestDate: {
    addTestDateHeader: 'Update a test date for {{requestName}}',
    confirmation: 'Test date {{date}} has been updated',
    submitButton: 'Update date'
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
