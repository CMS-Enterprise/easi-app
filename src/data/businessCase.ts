import cloneDeep from 'lodash/cloneDeep';

import {
  BusinessCaseModel,
  EstimatedLifecycleCostLines,
  ProposedBusinessCaseSolution
} from 'types/businessCase';
import { LifecycleCosts } from 'types/estimatedLifecycle';

const emptyPhaseValues = {
  development: {
    isPresent: false,
    cost: ''
  },
  operationsMaintenance: {
    isPresent: false,
    cost: ''
  },
  other: {
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
  cmsBenefit: '',
  priorityAlignment: '',
  successIndicators: '',
  asIsSolution: {
    title: '',
    summary: '',
    pros: '',
    cons: '',
    estimatedLifecycleCost: cloneDeep(defaultEstimatedLifecycle),
    costSavings: ''
  },
  preferredSolution: cloneDeep(defaultProposedSolution),
  alternativeA: cloneDeep(defaultProposedSolution),
  alternativeB: cloneDeep(defaultProposedSolution),
  createdAt: ''
};

type lifecycleCostLinesType = {
  'As Is': EstimatedLifecycleCostLines;
  Preferred: EstimatedLifecycleCostLines;
  A: EstimatedLifecycleCostLines;
  B: EstimatedLifecycleCostLines;
};

// Function that lets us know if a user has filled out an alternative B
export const hasAlternativeB = (alternativeB: ProposedBusinessCaseSolution) => {
  if (!alternativeB) {
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
  } = alternativeB;

  let hasLineItem;
  Object.values(estimatedLifecycleCost).forEach(phase => {
    if (
      phase.development.isPresent ||
      phase.operationsMaintenance.isPresent ||
      phase.other.isPresent
    ) {
      hasLineItem = true;
    }
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
    Other: 'other'
  };

  const lifecycleCostLines: lifecycleCostLinesType = {
    'As Is': cloneDeep(defaultEstimatedLifecycle),
    Preferred: cloneDeep(defaultEstimatedLifecycle),
    A: cloneDeep(defaultEstimatedLifecycle),
    B: cloneDeep(defaultEstimatedLifecycle)
  };

  let doesAltBHaveLifecycleCostLines = false;

  businessCase.lifecycleCostLines.forEach((line: any) => {
    const phaseType: 'development' | 'operationsMaintenance' | 'other' =
      phaseTypeMap[`${line.phase}`];

    if (line.solution === 'B') {
      doesAltBHaveLifecycleCostLines = true;
    }

    lifecycleCostLines[line.solution as keyof lifecycleCostLinesType][
      `year${line.year}` as keyof EstimatedLifecycleCostLines
    ][phaseType] = {
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
    createdAt: businessCase.createdAt,
    initialSubmittedAt: businessCase.initialSubmittedAt,
    lastSubmittedAt: businessCase.lastSubmittedAt
  };
};

export const prepareBusinessCaseForApi = (
  businessCase: BusinessCaseModel
): any => {
  const alternativeBExists = hasAlternativeB(businessCase.alternativeB);
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

  const yearMap = (
    lifecycleCostLines: EstimatedLifecycleCostLines
  ): { phases: LifecycleCosts; year: string }[] => {
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
          const { development, operationsMaintenance, other } = phases;
          const developmentCost = {
            solution: solutionApiName,
            phase: 'Development',
            cost: development.isPresent ? parseFloat(development.cost) : null,
            year
          };
          const omCost = {
            solution: solutionApiName,
            phase: 'Operations and Maintenance',
            cost: operationsMaintenance.isPresent
              ? parseFloat(phases.operationsMaintenance.cost)
              : null,
            year
          };
          const otherCost = {
            solution: solutionApiName,
            phase: 'Other',
            cost: other.isPresent ? parseFloat(phases.other.cost) : null,
            year
          };
          return [developmentCost, omCost, otherCost];
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
    systemIntakeId: businessCase.systemIntakeId,
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
