const intake = {
  fields: {
    projectName: 'Project name',
    requester: 'Requester',
    submissionDate: 'Submission date',
    requestFor: 'Request for',
    component: 'Component'
  },
  lifecycleId: 'Lifecycle ID',
  csvHeadings: {
    euaId: 'EUA ID',
    requesterName: 'Requester Name',
    requesterComponent: 'Requester Component',
    businessOwnerName: 'Business Owner Name',
    businessOwnerComponent: 'Business Owner Component',
    productManagerName: 'Product Manager Name',
    productManagerComponent: 'Product Manager Component',
    isso: 'ISSO Name',
    trbCollaborator: 'TRB Collaborator Name',
    oitCollaborator: 'OIT security Collaborator Name',
    eaCollaborator: 'EA Collaborator Name',
    projectName: 'Project Name',
    existingFunding: 'Existing Funding',
    fundingSource: 'Funding Source',
    fundingNumber: 'Funding Number',
    businessNeed: 'Business Need',
    businessSolution: 'Business Solution',
    currentStage: 'Process Status',
    eaSupport: 'EA Support Requested',
    isExpectingCostIncrease: 'Expecting Cost Increase',
    expectedIncreaseAmount: 'Expected Increase Amount',
    existingContract: 'Existing Contract',
    contractors: 'Contractor(s)',
    contractVehicle: 'Contract Vehicle',
    contractStart: 'Period of Performance Start',
    contractEnd: 'Period of Performance End',
    status: 'Status',
    updatedAt: 'Updated At',
    submittedAt: 'Submitted At',
    createdAt: 'Created At',
    decidedAt: 'Decided At',
    archivedAt: 'Archived At'
  },
  requestTypeForm: {
    heading: 'Make a System Request',
    subheading: 'What is this request for?',
    info:
      'If you are unsure or do not see an option for your use-case, mark "I\'m not sure" and someone from the Governance Team will assist you',
    fields: {
      addNewSystem: 'Add a new system',
      majorChanges: 'Major changes or upgrades to an existing system',
      recompete:
        'Re-compete a contract without any changes to systems or services',
      shutdown: 'Shutdown a system'
    },
    helpAndGuidance: {
      majorChanges: {
        label: 'What is a major change?',
        para: 'A major change could be any of the following:',
        list: [
          'Moving a system from a physical data center to the cloud',
          'Software platform changes',
          'New system integrations/interconnections',
          'Changes in Major Function Alignments or the Data Categories a system supports'
        ]
      }
    }
  }
};

export default intake;
