const csvHeaderMap = (t: any) => [
  { key: 'euaUserID', label: t('intake:csvHeadings.euaId') },
  { key: 'requester.name', label: t('intake:csvHeadings.requesterName') },
  {
    key: 'requester.component',
    label: t('intake:csvHeadings.requesterComponent')
  },
  {
    key: 'businessOwner.name',
    label: t('intake:csvHeadings.businessOwnerName')
  },
  {
    key: 'businessOwner.component',
    label: t('intake:csvHeadings.businessOwnerComponent')
  },
  {
    key: 'productManager.name',
    label: t('intake:csvHeadings.productManagerName')
  },
  {
    key: 'productManager.component',
    label: t('intake:csvHeadings.productManagerComponent')
  },
  {
    key: 'isso.name',
    label: t('intake:csvHeadings.isso')
  },
  {
    key: 'trbCollaborator',
    label: t('intake:csvHeadings.trbCollaborator')
  },
  {
    key: 'oitCollaborator',
    label: t('intake:csvHeadings.oitCollaborator')
  },
  {
    key: 'eaCollaborator',
    label: t('intake:csvHeadings.eaCollaborator')
  },
  {
    key: 'requestName',
    label: t('intake:csvHeadings.projectName')
  },
  {
    key: 'fundingSource.isFunded',
    label: t('intake:csvHeadings.existingFunding')
  },
  {
    key: 'fundingSource.source',
    label: t('intake:csvHeadings.fundingSource')
  },
  {
    key: 'fundingSource.fundingNumber',
    label: t('intake:csvHeadings.fundingNumber')
  },
  {
    key: 'businessNeed',
    label: t('intake:csvHeadings.businessNeed')
  },
  {
    key: 'businessSolution',
    label: t('intake:csvHeadings.businessSolution')
  },
  {
    key: 'currentStage',
    label: t('intake:csvHeadings.currentStage')
  },
  {
    key: 'needsEaSupport',
    label: t('intake:csvHeadings.eaSupport')
  },
  {
    key: 'costs.isExpectingIncrease',
    label: t('intake:csvHeadings.isExpectingCostIncrease')
  },
  {
    key: 'costs.expectedIncreaseAmount',
    label: t('intake:csvHeadings.expectedIncreaseAmount')
  },
  {
    key: 'contract.hasContract',
    label: t('intake:csvHeadings.existingContract')
  },
  {
    key: 'contract.contractor',
    label: t('intake:csvHeadings.contractors')
  },
  {
    key: 'contract.vehicle',
    label: t('intake:csvHeadings.contractVehicle')
  },
  {
    key: 'contractStartDate',
    label: t('intake:csvHeadings.contractStart')
  },
  {
    key: 'contractEndDate',
    label: t('intake:csvHeadings.contractEnd')
  },
  {
    key: 'status',
    label: t('intake:csvHeadings.status')
  },
  {
    key: 'lcidScope',
    label: t('intake:csvHeadings.lcidScope')
  },
  {
    key: 'lastAdminNote',
    label: t('intake:csvHeadings.lastAdminNote')
  },
  {
    key: 'updatedAt',
    label: t('intake:csvHeadings.updatedAt')
  },
  {
    key: 'submittedAt',
    label: t('intake:csvHeadings.submittedAt')
  },
  {
    key: 'createdAt',
    label: t('intake:csvHeadings.createdAt')
  },
  {
    key: 'decidedAt',
    label: t('intake:csvHeadings.decidedAt')
  },
  {
    key: 'archivedAt',
    label: t('intake:csvHeadings.archivedAt')
  },
  {
    key: 'adminLead',
    label: t('intake:csvHeadings.adminLead')
  }
];

export default csvHeaderMap;
