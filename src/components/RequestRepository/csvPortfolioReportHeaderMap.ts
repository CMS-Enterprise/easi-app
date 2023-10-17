const csvHeaderMap = (t: any) => [
  {
    key: 'requestName',
    label: t('intake:csvHeadings.projectName')
  },
  {
    key: 'requesterComponent',
    label: t('intake:csvHeadings.requesterComponent')
  },
  {
    key: 'lastAdminNote.content',
    label: t('intake:csvHeadings.lastAdminNote')
  },
  {
    key: 'productManager.name',
    label: t('intake:csvHeadings.productManagerName')
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
    key: 'fundingSource.source',
    label: t('intake:csvHeadings.fundingSource')
  },
  {
    key: 'fundingSource.fundingNumber',
    label: t('intake:csvHeadings.fundingNumber')
  },
  {
    key: 'costs.expectedIncreaseAmount',
    label: t('intake:csvHeadings.expectedIncreaseAmount')
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
    key: 'contract.EndDate',
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
    key: 'adminLead',
    label: t('intake:csvHeadings.adminLead')
  },
  {
    key: 'updatedAt',
    label: t('intake:csvHeadings.updatedAt')
  },
  {
    key: 'submittedAt',
    label: t('intake:csvHeadings.submittedAt')
  }
];

export default csvHeaderMap;
