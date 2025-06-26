const admin = {
  title: 'System information',
  description:
    'This request is related to the system(s) indicated below. They could be related for a variety of reasons, including because this request funds the system or because this request uses the system in its proposed technical solution.',
  somethingIncorrect: 'See something incorrect?',
  editInformation: 'Edit system information',
  component: 'CMS component owner',
  businessOwner: 'Business Owner',
  viewSystem: 'View system profile',
  serviceOrContract: 'Service or contract names',
  contractNumber: 'Contract number',
  contractNumber_plural: 'Contract numbers',
  unlinkedAlert:
    'EASi cannot display any additional information or related requests because this IT Governance request is not currently linked to a system, service, or contract. If this is an error, please use the button below to link the request.',
  newSystemAlert:
    'This request is for a completely new system, service, or contract and may not have other requests related to it. If this is an error, please use the button below to link the request to a system, service, or contract.',
  linkSystem: 'Link this request to a system, service, or contract',
  noContractNumber: 'No contract number listed',
  relatedRequests: 'Related requests',
  tableColumns: {
    projectTitle: 'Project title',
    process: 'Process',
    contractNumber: 'Contract number',
    status: 'Status',
    submissionDate: 'Submission date'
  },
  relatedRequestsTable: {
    id: 'related-requests-table',
    title: 'Related requests',
    empty: 'There are no additional requests linked to this system'
  }
};

export default admin;
