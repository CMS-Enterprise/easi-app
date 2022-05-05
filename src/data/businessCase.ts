import cloneDeep from 'lodash/cloneDeep';

import {
  BusinessCaseModel,
  EstimatedLifecycleCostLines,
  ProposedBusinessCaseSolution
} from 'types/businessCase';
import { CostData, LifecycleCosts } from 'types/estimatedLifecycle';

const emptyPhaseValues = {
  development: {
    phase: 'Development',
    isPresent: false,
    cost: ''
  },
  operationsMaintenance: {
    phase: 'Operations and Maintenance',
    isPresent: false,
    cost: ''
  },
  helpDesk: {
    phase: 'Help desk/call center',
    isPresent: false,
    cost: ''
  },
  software: {
    phase: 'Software licenses',
    isPresent: false,
    cost: ''
  },
  planning: {
    phase: 'Planning, support, and professional services',
    isPresent: false,
    cost: ''
  },
  infrastructure: {
    phase: 'Infrastructure',
    isPresent: false,
    cost: ''
  },
  oit: {
    phase: 'OIT services, tools, and pilots',
    isPresent: false,
    cost: ''
  },
  other: {
    phase: 'Other services, tools, and pilots',
    isPresent: false,
    cost: ''
  }
};

export const defaultEstimatedLifecycle = {
  year1: cloneDeep(emptyPhaseValues),
  year2: cloneDeep(emptyPhaseValues),
  year3: cloneDeep(emptyPhaseValues),
  year4: cloneDeep(emptyPhaseValues),
  year5: cloneDeep(emptyPhaseValues)
};

export const defaultProposedSolution = {
  title: '',
  summary: '',
  acquisitionApproach: '',
  pros: '',
  cons: '',
  estimatedLifecycleCost: cloneDeep(defaultEstimatedLifecycle),
  costSavings: '',
  security: {
    isApproved: null,
    isBeingReviewed: ''
  },
  hosting: {
    type: '',
    location: '',
    cloudServiceType: ''
  },
  hasUserInterface: ''
};

export const businessCaseInitialData: BusinessCaseModel = {
  status: 'OPEN',
  systemIntakeId: '',
  systemIntakeStatus: '',
  requestName: '',
  requester: {
    name: '',
    phoneNumber: ''
  },
  businessOwner: {
    name: ''
  },
  businessNeed: '',
  currentSolutionSummary: '',
  cmsBenefit: '',
  priorityAlignment: '',
  successIndicators: '',
  preferredSolution: cloneDeep(defaultProposedSolution),
  alternativeA: cloneDeep(defaultProposedSolution),
  alternativeB: cloneDeep(defaultProposedSolution),
  createdAt: ''
};

type lifecycleCostLinesType = {
  Preferred: EstimatedLifecycleCostLines;
  A: EstimatedLifecycleCostLines;
  B: EstimatedLifecycleCostLines;
};

/**
 * This function tells us whether the parameter alternativeSolution has been started
 * @param alternativeSolution - an alternative solution case (e.g. A, B)
 */
export const alternativeSolutionHasFilledFields = (
  alternativeSolution: ProposedBusinessCaseSolution
) => {
  if (!alternativeSolution) {
    return false;
  }

  const {
    title,
    summary,
    acquisitionApproach,
    security,
    hosting,
    hasUserInterface,
    pros,
    cons,
    costSavings,
    estimatedLifecycleCost
  } = alternativeSolution;

  const hasLineItem = !!Object.values(estimatedLifecycleCost).find(year => {
    return Object.values(year).find(phase => phase.isPresent);
  });

  return (
    title ||
    summary ||
    acquisitionApproach ||
    security.isApproved ||
    security.isBeingReviewed ||
    hosting.type ||
    hosting.location ||
    hosting.cloudServiceType ||
    hasUserInterface ||
    pros ||
    cons ||
    costSavings ||
    hasLineItem
  );
};

export const prepareBusinessCaseForApp = (
  businessCase: any
): BusinessCaseModel => {
  const phaseTypeMap: any = {
    Development: 'development',
    'Operations and Maintenance': 'operationsMaintenance',
    'Help desk/call center': 'helpDesk',
    'Software licenses': 'software',
    'Planning, support, and professional services': 'planning',
    Infrastructure: 'infrastructure',
    'OIT services, tools, and pilots': 'oit',
    Other: 'other'
  };

  const lifecycleCostLines: lifecycleCostLinesType = {
    Preferred: cloneDeep(defaultEstimatedLifecycle),
    A: cloneDeep(defaultEstimatedLifecycle),
    B: cloneDeep(defaultEstimatedLifecycle)
  };

  let doesAltBHaveLifecycleCostLines = false;

  businessCase.lifecycleCostLines.forEach((line: any) => {
    const phaseType:
      | 'development'
      | 'operationsMaintenance'
      | 'helpDesk'
      | 'software'
      | 'planning'
      | 'infrastructure'
      | 'oit'
      | 'other' = phaseTypeMap[`${line.phase}`];

    if (line.solution === 'B') {
      doesAltBHaveLifecycleCostLines = true;
    }

    lifecycleCostLines[line.solution as keyof lifecycleCostLinesType][
      `year${line.year}` as keyof EstimatedLifecycleCostLines
    ][phaseType] = {
      phase: line.phase,
      isPresent: !!line.cost,
      cost: line.cost ? line.cost.toString() : ''
    };
  });

  if (!doesAltBHaveLifecycleCostLines) {
    lifecycleCostLines.B = cloneDeep(defaultEstimatedLifecycle);
  }

  return {
    id: businessCase.id,
    euaUserId: businessCase.euaUserId,
    status: businessCase.status,
    systemIntakeId: businessCase.systemIntakeId,
    systemIntakeStatus: businessCase.systemIntakeStatus,
    requestName: businessCase.projectName,
    requester: {
      name: businessCase.requester,
      phoneNumber: businessCase.requesterPhoneNumber
    },
    businessOwner: {
      name: businessCase.businessOwner
    },
    businessNeed: businessCase.businessNeed,
    currentSolutionSummary: businessCase.currentSolutionSummary,
    cmsBenefit: businessCase.cmsBenefit,
    priorityAlignment: businessCase.priorityAlignment,
    successIndicators: businessCase.successIndicators,
    preferredSolution: {
      title: businessCase.preferredTitle,
      summary: businessCase.preferredSummary,
      acquisitionApproach: businessCase.preferredAcquisitionApproach,
      pros: businessCase.preferredPros,
      cons: businessCase.preferredCons,
      costSavings: businessCase.preferredCostSavings,
      estimatedLifecycleCost: lifecycleCostLines.Preferred,
      security: {
        isApproved: businessCase.preferredSecurityIsApproved,
        isBeingReviewed: businessCase.preferredSecurityIsBeingReviewed
      },
      hosting: {
        type: businessCase.preferredHostingType,
        location: businessCase.preferredHostingLocation,
        cloudServiceType: businessCase.preferredHostingCloudServiceType
      },
      hasUserInterface: businessCase.preferredHasUI
    },
    alternativeA: {
      title: businessCase.alternativeATitle,
      summary: businessCase.alternativeASummary,
      acquisitionApproach: businessCase.alternativeAAcquisitionApproach,
      pros: businessCase.alternativeAPros,
      cons: businessCase.alternativeACons,
      costSavings: businessCase.alternativeACostSavings,
      estimatedLifecycleCost: lifecycleCostLines.A,
      security: {
        isApproved: businessCase.alternativeASecurityIsApproved,
        isBeingReviewed: businessCase.alternativeASecurityIsBeingReviewed
      },
      hosting: {
        type: businessCase.alternativeAHostingType,
        location: businessCase.alternativeAHostingLocation,
        cloudServiceType: businessCase.alternativeAHostingCloudServiceType
      },
      hasUserInterface: businessCase.alternativeAHasUI
    },
    alternativeB: {
      title: businessCase.alternativeBTitle || '',
      summary: businessCase.alternativeBSummary || '',
      acquisitionApproach: businessCase.alternativeBAcquisitionApproach || '',
      pros: businessCase.alternativeBPros || '',
      cons: businessCase.alternativeBCons || '',
      costSavings: businessCase.alternativeBCostSavings || '',
      estimatedLifecycleCost: lifecycleCostLines.B,
      security: {
        isApproved: businessCase.alternativeBSecurityIsApproved,
        isBeingReviewed: businessCase.alternativeBSecurityIsBeingReviewed || ''
      },
      hosting: {
        type: businessCase.alternativeBHostingType || '',
        location: businessCase.alternativeBHostingLocation || '',
        cloudServiceType: businessCase.alternativeBHostingCloudServiceType || ''
      },
      hasUserInterface: businessCase.alternativeBHasUI || ''
    },
    createdAt: businessCase.createdAt
  };
};

export const prepareBusinessCaseForApi = (
  businessCase: BusinessCaseModel
): any => {
  const alternativeBExists = alternativeSolutionHasFilledFields(
    businessCase.alternativeB
  );
  const solutionNameMap: {
    solutionLifecycleCostLines: EstimatedLifecycleCostLines;
    solutionApiName: string;
  }[] = [
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
    ...(alternativeBExists
      ? [
          {
            solutionLifecycleCostLines:
              businessCase.alternativeB.estimatedLifecycleCost,
            solutionApiName: 'B'
          }
        ]
      : [])
  ];

  const lifecycleCostLines = solutionNameMap
    .map(({ solutionLifecycleCostLines, solutionApiName }) => {
      let yearCount = 1;
      return Object.values(solutionLifecycleCostLines).reduce((acc, year) => {
        const phases = Object.values(year).map(phase => {
          return {
            year: yearCount.toString(),
            solution: solutionApiName,
            ...phase,
            cost: phase.cost ? parseFloat(phase.cost) : 0
          };
        });
        yearCount += 1;
        return [...acc, ...phases];
      }, [] as { year: string; solution: string; phase: string; isPresent: boolean; cost: number }[]);
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
    systemIntakeId: businessCase.systemIntakeId,
    projectName: businessCase.requestName,
    requester: businessCase.requester.name,
    requesterPhoneNumber: businessCase.requester.phoneNumber,
    businessOwner: businessCase.businessOwner.name,
    businessNeed: businessCase.businessNeed,
    currentSolutionSummary: businessCase.currentSolutionSummary,
    cmsBenefit: businessCase.cmsBenefit,
    priorityAlignment: businessCase.priorityAlignment,
    successIndicators: businessCase.successIndicators,
    preferredTitle: businessCase.preferredSolution.title,
    preferredSummary: businessCase.preferredSolution.summary,
    preferredAcquisitionApproach:
      businessCase.preferredSolution.acquisitionApproach,
    preferredSecurityIsApproved:
      businessCase.preferredSolution.security.isApproved,
    preferredSecurityisBeingReviewed:
      businessCase.preferredSolution.security.isBeingReviewed,
    preferredHostingType: businessCase.preferredSolution.hosting.type,
    preferredHostingLocation: businessCase.preferredSolution.hosting.location,
    preferredHostingCloudServiceType:
      businessCase.preferredSolution.hosting.cloudServiceType,
    preferredHasUI: businessCase.preferredSolution.hasUserInterface,
    preferredPros: businessCase.preferredSolution.pros,
    preferredCons: businessCase.preferredSolution.cons,
    preferredCostSavings: businessCase.preferredSolution.costSavings,
    alternativeATitle: businessCase.alternativeA.title,
    alternativeASummary: businessCase.alternativeA.summary,
    alternativeAAcquisitionApproach:
      businessCase.alternativeA.acquisitionApproach,
    alternativeASecurityIsApproved:
      businessCase.alternativeA.security.isApproved,
    alternativeASecurityisBeingReviewed:
      businessCase.alternativeA.security.isBeingReviewed,
    alternativeAHostingType: businessCase.alternativeA.hosting.type,
    alternativeAHostingLocation: businessCase.alternativeA.hosting.location,
    alternativeAHostingCloudServiceType:
      businessCase.alternativeA.hosting.cloudServiceType,
    alternativeAHasUI: businessCase.alternativeA.hasUserInterface,
    alternativeAPros: businessCase.alternativeA.pros,
    alternativeACons: businessCase.alternativeA.cons,
    alternativeACostSavings: businessCase.alternativeA.costSavings,
    alternativeBTitle: alternativeBExists
      ? businessCase.alternativeB.title
      : null,
    alternativeBSummary: alternativeBExists
      ? businessCase.alternativeB.summary
      : null,
    alternativeBAcquisitionApproach: alternativeBExists
      ? businessCase.alternativeB.acquisitionApproach
      : null,
    alternativeBSecurityIsApproved: alternativeBExists
      ? businessCase.alternativeB.security.isApproved
      : null,
    alternativeBSecurityisBeingReviewed: alternativeBExists
      ? businessCase.alternativeB.security.isBeingReviewed
      : null,
    alternativeBHostingType: alternativeBExists
      ? businessCase.alternativeB.hosting.type
      : null,
    alternativeBHostingLocation: alternativeBExists
      ? businessCase.alternativeB.hosting.location
      : null,
    alternativeBHostingCloudServiceType: alternativeBExists
      ? businessCase.alternativeB.hosting.cloudServiceType
      : null,
    alternativeBHasUI: alternativeBExists
      ? businessCase.alternativeB.hasUserInterface
      : null,
    alternativeBPros: alternativeBExists
      ? businessCase.alternativeB.pros
      : null,
    alternativeBCons: alternativeBExists
      ? businessCase.alternativeB.cons
      : null,
    alternativeBCostSavings: alternativeBExists
      ? businessCase.alternativeB.costSavings
      : null,
    lifecycleCostLines
  };
};

export const hostingTypeMap: any = {
  cloud: 'Yes, in the cloud (AWS, Azure, etc.)',
  dataCenter: 'Yes, at a data center',
  none: 'No, hosting is not needed'
};
