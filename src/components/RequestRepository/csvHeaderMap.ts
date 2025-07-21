const csvHeaderMap = (t: any) => [
  { key: 'euaUserId', label: t('intake:csvHeadings.euaId') },
  { key: 'requesterName', label: t('intake:csvHeadings.requesterName') },
  {
    key: 'requesterComponent',
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
    key: 'trbCollaboratorName',
    label: t('intake:csvHeadings.trbCollaborator')
  },
  {
    key: 'oitSecurityCollaboratorName',
    label: t('intake:csvHeadings.oitCollaborator')
  },
  {
    key: 'collaboratorName508',
    label: t('intake:csvHeadings.collaborator508')
  },
  {
    key: 'requestName',
    label: t('intake:csvHeadings.projectName')
  },
  {
    key: 'existingFunding',
    label: t('intake:csvHeadings.existingFunding')
  },
  {
    key: 'fundingSources',
    label: t('intake:csvHeadings.fundingSource')
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
    key: 'usesAiTech',
    label: t('intake:csvHeadings.usesAiTech')
  },
  {
    key: 'needsEaSupport',
    label: t('intake:csvHeadings.eaSupport')
  },
  {
    key: 'hasUiChanges',
    label: t('intake:csvHeadings.hasUiChanges')
  },
  {
    key: 'annualSpending.currentAnnualSpending',
    label: t('intake:csvHeadings.currentAnnualSpend')
  },
  {
    key: 'annualSpending.currentAnnualSpendingITPortion',
    label: t('intake:csvHeadings.currentAnnualSpendITPortion')
  },
  {
    key: 'annualSpending.plannedYearOneSpending',
    label: t('intake:csvHeadings.plannedAnnualSpend')
  },
  {
    key: 'annualSpending.plannedYearOneSpendingITPortion',
    label: t('intake:csvHeadings.plannedAnnualSpendITPortion')
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
    key: 'contract.startDate',
    label: t('intake:csvHeadings.contractStart')
  },
  {
    key: 'contract.endDate',
    label: t('intake:csvHeadings.contractEnd')
  },
  {
    key: 'contractName',
    label: t('intake:csvHeadings.contractName')
  },
  {
    key: 'contractNumber',
    label: t('intake:csvHeadings.contractNumber')
  },
  {
    key: 'cmsSystem',
    label: t('intake:csvHeadings.cmsSystem')
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
    key: 'lastAdminNote.content',
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
