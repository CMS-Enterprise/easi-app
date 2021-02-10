// This is for the CMS 508 project flow

const accessibility = {
  documentTable: {
    header: {
      actions: 'Actions',
      name: 'Name',
      uploaedAt: 'Uploaded At'
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
  }
};

export default accessibility;
