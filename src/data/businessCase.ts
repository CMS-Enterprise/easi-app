import {
  BusinessCaseModel,
  EstimatedLifecycleCostLines
} from 'types/businessCase';

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
  requestName: '',
  requester: {
    name: '',
    phoneNumber: ''
  },
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

const emptyEstimatedLifecycle = {
  year1: [],
  year2: [],
  year3: [],
  year4: [],
  year5: []
};

export const prepareBusinessCaseForApp = (
  businessCase: any
): BusinessCaseModel => {
  const yearMap: { [index: string]: keyof EstimatedLifecycleCostLines } = {
    '1': 'year1',
    '2': 'year2',
    '3': 'year3',
    '4': 'year4',
    '5': 'year5'
  };

  type lifecycleCostLinesType = {
    'As Is': EstimatedLifecycleCostLines;
    Preferred: EstimatedLifecycleCostLines;
    A: EstimatedLifecycleCostLines;
    B: EstimatedLifecycleCostLines;
  };
  const lifecycleCostLines: lifecycleCostLinesType = {
    'As Is': emptyEstimatedLifecycle,
    Preferred: emptyEstimatedLifecycle,
    A: emptyEstimatedLifecycle,
    B: emptyEstimatedLifecycle
  };

  businessCase.lifecycleCostLines.forEach((line: any) => {
    lifecycleCostLines[line.solution as keyof lifecycleCostLinesType][
      yearMap[line.year]
    ].push({ phase: line.phase, cost: line.cost });
  });

  return {
    requestName: businessCase.projectName || '',
    requester: {
      name: businessCase.requester || '',
      phoneNumber: businessCase.requesterPhoneNumber || ''
    },
    businessOwner: {
      name: businessCase.businessOwner || ''
    },
    businessNeed: businessCase.businessNeed || '',
    cmsBenefit: businessCase.cmsBenefit || '',
    priorityAlignment: businessCase.priorityAlignment || '',
    successIndicators: businessCase.successIndicators || '',
    asIsSolution: {
      title: businessCase.asIsTitle,
      summary: businessCase.asIsSummary,
      pros: businessCase.asIsPros,
      cons: businessCase.asIsCons,
      costSavings: businessCase.asIsCostSavings,
      estimatedLifecycleCost: lifecycleCostLines['As Is']
    },
    preferredSolution: {
      title: businessCase.preferredTitle,
      summary: businessCase.preferredSummary,
      acquisitionApproach: businessCase.preferredAcquisitionApproach,
      pros: businessCase.preferredPros,
      cons: businessCase.preferredCons,
      costSavings: businessCase.preferredCostSavings,
      estimatedLifecycleCost: lifecycleCostLines.Preferred
    },
    alternativeA: {
      title: businessCase.alternativeATitle,
      summary: businessCase.alternativeASummary,
      acquisitionApproach: businessCase.alternativeAAcquisitionApproach,
      pros: businessCase.alternativeAPros,
      cons: businessCase.alternativeACons,
      costSavings: businessCase.alternativeACostSavings,
      estimatedLifecycleCost: lifecycleCostLines.A
    },
    alternativeB: {
      title: businessCase.alternativeBTitle,
      summary: businessCase.alternativeBSummary,
      acquisitionApproach: businessCase.alternativeBAcquisitionApproach,
      pros: businessCase.alternativeBPros,
      cons: businessCase.alternativeBCons,
      costSavings: businessCase.alternativeBCostSavings,
      estimatedLifecycleCost: lifecycleCostLines.B
    }
  };
};
