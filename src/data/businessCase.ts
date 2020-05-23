import {
  BusinessCaseModel,
  EstimatedLifecycleCostLines
} from 'types/businessCase';
import { LifecyclePhase } from 'types/estimatedLifecycle';

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
  status: 'DRAFT',
  systemIntakeId: '',
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

type lifecycleCostLinesType = {
  'As Is': EstimatedLifecycleCostLines;
  Preferred: EstimatedLifecycleCostLines;
  A: EstimatedLifecycleCostLines;
  B: EstimatedLifecycleCostLines;
};

export const prepareBusinessCaseForApp = (
  businessCase: any
): BusinessCaseModel => {
  const lifecycleCostLines: lifecycleCostLinesType = {
    'As Is': {
      year1: [],
      year2: [],
      year3: [],
      year4: [],
      year5: []
    },
    Preferred: {
      year1: [],
      year2: [],
      year3: [],
      year4: [],
      year5: []
    },
    A: {
      year1: [],
      year2: [],
      year3: [],
      year4: [],
      year5: []
    },
    B: {
      year1: [],
      year2: [],
      year3: [],
      year4: [],
      year5: []
    }
  };

  businessCase.lifecycleCostLines.forEach((line: any) => {
    const solution = (solutionName => {
      switch (solutionName) {
        case 'As Is':
          return lifecycleCostLines['As Is'];
        case 'Preferred':
          return lifecycleCostLines.Preferred;
        case 'A':
          return lifecycleCostLines.A;
        case 'B':
          return lifecycleCostLines.B;
        default:
          return null;
      }
    })(line.solution);
    if (solution) {
      solution[`year${line.year}` as keyof EstimatedLifecycleCostLines].push({
        phase: line.phase || '',
        cost: line.cost || ''
      });
    }
  });

  return {
    id: businessCase.id,
    euaUserId: businessCase.euaUserId,
    status: businessCase.status,
    systemIntakeId: businessCase.systemIntake,
    requestName: businessCase.projectName,
    requester: {
      name: businessCase.requester,
      phoneNumber: businessCase.requesterPhoneNumber
    },
    businessOwner: {
      name: businessCase.businessOwner
    },
    businessNeed: businessCase.businessNeed,
    cmsBenefit: businessCase.cmsBenefit,
    priorityAlignment: businessCase.priorityAlignment,
    successIndicators: businessCase.successIndicators,
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
    ...(businessCase.alternativeBTitle ||
      businessCase.alternativeBSummary ||
      businessCase.alternativeBAcquisitionApproach ||
      businessCase.alternativeBPros ||
      businessCase.alternativeBCons ||
      (businessCase.alternativeBCostSavings && {
        alternativeB: {
          title: businessCase.alternativeBTitle,
          summary: businessCase.alternativeBSummary,
          acquisitionApproach: businessCase.alternativeBAcquisitionApproach,
          pros: businessCase.alternativeBPros,
          cons: businessCase.alternativeBCons,
          costSavings: businessCase.alternativeBCostSavings,
          estimatedLifecycleCost: lifecycleCostLines.B
        }
      }))
  };
};

export const prepareBusinessCaseForApi = (
  businessCase: BusinessCaseModel
): any => {
  const solutionNameMap: {
    solutionLifecycleCostLines: EstimatedLifecycleCostLines;
    solutionApiName: string;
  }[] = [
    {
      solutionLifecycleCostLines:
        businessCase.asIsSolution.estimatedLifecycleCost,
      solutionApiName: 'As Is'
    },
    {
      solutionLifecycleCostLines:
        businessCase.preferredSolution.estimatedLifecycleCost,
      solutionApiName: 'Preferred'
    },
    {
      solutionLifecycleCostLines:
        businessCase.alternativeA.estimatedLifecycleCost,
      solutionApiName: 'A'
    },
    ...(businessCase.alternativeB
      ? [
          {
            solutionLifecycleCostLines:
              businessCase.alternativeB.estimatedLifecycleCost,
            solutionApiName: 'B'
          }
        ]
      : [])
  ];

  const yearMap = (
    lifecycleCostLines: EstimatedLifecycleCostLines
  ): { phases: LifecyclePhase[]; year: string }[] => {
    return [
      { phases: lifecycleCostLines.year1, year: '1' },
      { phases: lifecycleCostLines.year2, year: '2' },
      { phases: lifecycleCostLines.year3, year: '3' },
      { phases: lifecycleCostLines.year4, year: '4' },
      { phases: lifecycleCostLines.year5, year: '5' }
    ];
  };

  const lifecycleCostLines = solutionNameMap
    .map(({ solutionLifecycleCostLines, solutionApiName }) => {
      return yearMap(solutionLifecycleCostLines)
        .map(({ phases, year }) => {
          return phases.map(lifecyclePhase => {
            return {
              solution: solutionApiName,
              phase: lifecyclePhase.phase || null,
              cost: lifecyclePhase.cost || null,
              year
            };
          });
        })
        .flat();
    })
    .flat();

  return {
    ...(businessCase.id && {
      id: businessCase.id
    }),
    ...(businessCase.euaUserId && {
      euaUserId: businessCase.euaUserId
    }),
    status: businessCase.status,
    systemIntake: businessCase.systemIntakeId,
    projectName: businessCase.requestName,
    requester: businessCase.requester.name,
    requesterPhoneNumber: businessCase.requester.phoneNumber,
    businessOwner: businessCase.businessOwner.name,
    businessNeed: businessCase.businessNeed,
    cmsBenefit: businessCase.cmsBenefit,
    priorityAlignment: businessCase.priorityAlignment,
    successIndicators: businessCase.successIndicators,
    asIsTitle: businessCase.asIsSolution.title,
    asIsSummary: businessCase.asIsSolution.summary,
    asIsPros: businessCase.asIsSolution.pros,
    asIsCons: businessCase.asIsSolution.cons,
    asIsCostSavings: businessCase.asIsSolution.costSavings,
    preferredTitle: businessCase.preferredSolution.title,
    preferredSummary: businessCase.preferredSolution.summary,
    preferredAcquisitionApproach:
      businessCase.preferredSolution.acquisitionApproach,
    preferredPros: businessCase.preferredSolution.pros,
    preferredCons: businessCase.preferredSolution.cons,
    preferredCostSavings: businessCase.preferredSolution.costSavings,
    alternativeATitle: businessCase.alternativeA.title,
    alternativeASummary: businessCase.alternativeA.summary,
    alternativeAAcquisitionApproach:
      businessCase.alternativeA.acquisitionApproach,
    alternativeAPros: businessCase.alternativeA.pros,
    alternativeACons: businessCase.alternativeA.cons,
    alternativeACostSavings: businessCase.alternativeA.costSavings,
    alternativeBTitle: businessCase.alternativeB
      ? businessCase.alternativeB.title
      : '',
    alternativeBSummary: businessCase.alternativeB
      ? businessCase.alternativeB.summary
      : '',
    alternativeBAcquisitionApproach: businessCase.alternativeB
      ? businessCase.alternativeB.acquisitionApproach
      : '',
    alternativeBPros: businessCase.alternativeB
      ? businessCase.alternativeB.pros
      : '',
    alternativeBCons: businessCase.alternativeB
      ? businessCase.alternativeB.cons
      : '',
    alternativeBCostSavings: businessCase.alternativeB
      ? businessCase.alternativeB.costSavings
      : '',
    lifecycleCostLines
  };
};
