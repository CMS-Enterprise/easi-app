import { TFunction } from 'i18next';

const csvHeaderMap = (t: TFunction) => [
  {
    key: 'requestName',
    label: t('intake:csvHeadings.projectName')
  },
  {
    key: 'projectAcronym',
    label: t('intake:csvHeadings.projectAcronym')
  },
  {
    key: 'requester.userAccount.commonName',
    label: t('intake:csvHeadings.requesterName')
  },
  {
    key: 'requester.userAccount.username',
    label: t('intake:csvHeadings.euaId')
  },
  {
    key: 'requester.component',
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
    key: 'priorityAlignment',
    label: t('intake:csvHeadings.priorityAlignment')
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
    key: 'digitalServiceInteraction',
    label: t('intake:csvHeadings.digitalServiceInteraction')
  },
  {
    key: 'digitalServiceInteractionDescription',
    label: t('intake:csvHeadings.digitalServiceInteractionDescription')
  },
  {
    key: 'protectedCmsDataAccessedOutside',
    label: t('intake:csvHeadings.protectedCmsDataAccessedOutside')
  },
  {
    key: 'protectedCmsDataAccessedOutsideDescription',
    label: t('intake:csvHeadings.protectedCmsDataAccessedOutsideDescription')
  },
  {
    key: 'fundingSources',
    label: t('intake:csvHeadings.fundingSource')
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
    key: 'totalContractCosts.currentEstimatedCost',
    label: t('intake:csvHeadings.currentEstimatedCost')
  },
  {
    key: 'totalContractCosts.currentEstimatedCostITPortion',
    label: t('intake:csvHeadings.currentEstimatedCostITPortion')
  },
  {
    key: 'totalContractCosts.estimatedTotalContractValue',
    label: t('intake:csvHeadings.estimatedTotalContractValue')
  },
  {
    key: 'totalContractCosts.estimatedTotalContractValueITPortion',
    label: t('intake:csvHeadings.estimatedTotalContractValueITPortion')
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
    key: 'status',
    label: t('intake:csvHeadings.status')
  },
  {
    key: 'lcid',
    label: t('intake:csvHeadings.lcid')
  },
  {
    key: 'lcidType',
    label: t('intake:csvHeadings.lcidType')
  },
  {
    key: 'lcidComponent',
    label: t('intake:csvHeadings.lcidComponent')
  },
  {
    key: 'lcidIsShortened',
    label: t('intake:csvHeadings.lcidIsShortened')
  },
  {
    key: 'lcidIsLowIt',
    label: t('intake:csvHeadings.lcidIsLowIt')
  },
  {
    key: 'lcidScope',
    label: t('intake:csvHeadings.lcidScope')
  },
  {
    key: 'lcidExpiresAt',
    label: t('intake:csvHeadings.lcidExpiresAt')
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
