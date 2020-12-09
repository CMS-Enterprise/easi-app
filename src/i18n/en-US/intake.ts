const intake = {
  fields: {
    projectName: 'Project name',
    requester: 'Requester',
    submissionDate: 'Submission date',
    requestFor: 'Request for',
    component: 'Component',
    grtDate: 'GRT Date',
    grbDate: 'GRB Date',
    status: 'Status',
    fundingNumber: 'Funding number'
  },

  lifecycleId: 'Lifecycle ID',

  statusMap: {
    INTAKE_DRAFT: 'N/A',
    INTAKE_SUBMITTED: 'Intake request received',
    NEED_BIZ_CASE: 'Waiting for draft business case',
    BIZ_CASE_DRAFT: 'Waiting for draft business case',
    BIZ_CASE_DRAFT_SUBMITTED: 'Draft business case received',
    BIZ_CASE_CHANGES_NEEDED: 'Waiting for draft business case',
    BIZ_CASE_FINAL_NEEDED: 'Waiting for final business case',
    BIZ_CASE_FINAL_SUBMITTED: 'Final business case received',
    READY_FOR_GRT: 'Ready for GRT meeting',
    READY_FOR_GRB: 'Ready for GRB meeting',
    LCID_ISSUED: 'LCID: ',
    WITHDRAWN: 'Withdrawn',
    NOT_IT_REQUEST: 'Closed',
    NOT_APPROVED: 'Business case not approved',
    NO_GOVERNANCE: 'Closed',
    SHUTDOWN_IN_PROGRESS: 'Decomission in progress',
    SHUTDOWN_COMPLETE: 'Decommissioned'
  },
  banner: {
    title: {
      intakeIncomplete: 'Intake request incomplete',
      pendingResponse: 'Pending response',
      startBizCase: 'Start business case',
      bizCaseIncomplete: 'Business case incomplete',
      responseRecevied: 'Response received',
      prepareGrt: 'Prepare for GRT',
      prepareGrb: 'Prepare for GRB',
      decisionReceived: 'Decision received',
      requestWithdrawn: 'Request withdrawn'
    },
    description: {
      intakeIncomplete:
        'Your Intake Request is incomplete, please submit it when you are ready so that we can move you to the next phase.',
      intakeSubmitted:
        'Your Intake Request has been submitted for review. The Governance Admin team will get back to you about the next step.',
      checkNextStep:
        'The Governance Admin team has gotten back to you. Please check and take the next step.',
      bizCaseIncomplete:
        'Your Business Case is incomplete, please submit it when you are ready so that we can move you to the next step.',
      bizCaseSubmitted:
        'Your Business Case has been submitted for review. The Governance Admin team will get back to you about the next step.'
    }
  },
  requestTypeMap: {
    NEW: 'Add a new system',
    RECOMPETE: 'Re-compete',
    MAJOR_CHANGES: 'Major change or upgrade',
    SHUTDOWN: 'Decommission a system'
  },

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
      shutdown: 'Decommission a system'
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
