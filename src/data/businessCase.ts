import { BusinessCaseModel } from 'types/businessCase';

export const defaultEstimatedLifecycle = {
  year1: [{ phase: '', cost: '' }],
  year2: [{ phase: '', cost: '' }],
  year3: [{ phase: '', cost: '' }],
  year4: [{ phase: '', cost: '' }],
  year5: [{ phase: '', cost: '' }]
};

export const defaultProposedSolution = {
  title: '',
  summary: '',
  acquisitionApproach: '',
  pros: '',
  cons: '',
  estimatedLifecycleCost: defaultEstimatedLifecycle,
  costSavings: ''
};

export const businessCaseInitalData: BusinessCaseModel = {
  projectName: '',
  requester: {
    name: '',
    phoneNumber: ''
  },
  budgetNumber: '',
  businessOwner: {
    name: ''
  },
  businessNeed: '',
  cmsBenefit: '',
  priorityAlignment: '',
  successIndicators: '',
  asIsSolution: {
    title: '',
    summary: '',
    pros: '',
    cons: '',
    estimatedLifecycleCost: defaultEstimatedLifecycle,
    costSavings: ''
  },
  preferredSolution: defaultProposedSolution,
  alternativeA: defaultProposedSolution
};

export const prepareBusinessCaseForApi = (
  id: string,
  businessCase: BusinessCaseModel
) => {
  console.log(id, businessCase);
  return {};
};

export const prepareBusinessCaseForApp = (
  businessCase: any
): BusinessCaseModel => {
  console.log(businessCase);
  // TODO: need to see what the API model looks like
  return businessCaseInitalData;
};
