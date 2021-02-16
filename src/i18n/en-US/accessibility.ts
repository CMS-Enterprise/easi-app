// This is for the CMS 508 project flow

const accessibility = {
  documentTable: {
    caption: 'Documents uploaded for',
    header: {
      actions: 'Actions',
      documentName: 'Document',
      uploadedAt: 'Uploaded Date'
    },
    remove: 'Remove',
    view: 'View'
  },
  requestTable: {
    caption: 'Active 508 Requests',
    header: {
      requestName: 'Request Name',
      submissionDate: 'Submission Date',
      businessOwner: 'Business Owner',
      testDate: 'Test Date',
      pointOfContact: 'Point of Contact',
      status: 'Status'
    },
    lastUpdated: 'last updated on'
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
  newRequestForm: {
    heading: 'Add a new request',
    fields: {
      project: {
        label: 'Choose the project this request will belong to'
      },
      businessOwnerName: {
        label: 'Business Owner Name'
      },
      businessOwnerComponent: {
        label: 'Business Owner Component'
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
  }
};

export default accessibility;
