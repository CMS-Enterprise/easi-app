import cloneDeep from 'lodash/cloneDeep';

import {
  BusinessCaseModel,
  ProposedBusinessCaseSolution
} from 'types/businessCase';
import {
  ApiLifecycleCostLine,
  ApiLifecyclePhase,
  CostData,
  LifecycleCosts,
  LifecycleSolution,
  LifecycleYears
} from 'types/estimatedLifecycle';

const yearsObject = {
  year1: '',
  year2: '',
  year3: '',
  year4: '',
  year5: ''
};

export const defaultEstimatedLifecycle: LifecycleCosts = {
  development: {
    label: 'Development',
    isPresent: false,
    type: 'primary',
    years: cloneDeep(yearsObject)
  },
  operationsMaintenance: {
    label: 'Operations and Maintenance',
    isPresent: false,
    type: 'primary',
    years: cloneDeep(yearsObject)
  },
  helpDesk: {
    label: 'Help desk/call center',
    isPresent: false,
    type: 'related',
    years: cloneDeep(yearsObject)
  },
  software: {
    label: 'Software licenses',
    isPresent: false,
    type: 'related',
    years: cloneDeep(yearsObject)
  },
  planning: {
    label: 'Planning, support, and professional services',
    isPresent: false,
    type: 'related',
    years: cloneDeep(yearsObject)
  },
  infrastructure: {
    label: 'Infrastructure',
    isPresent: false,
    type: 'related',
    years: cloneDeep(yearsObject)
  },
  oit: {
    label: 'OIT services, tools, and pilots',
    isPresent: false,
    type: 'related',
    years: cloneDeep(yearsObject)
  },
  other: {
    label: 'Other services, tools, and pilots',
    isPresent: false,
    type: 'related',
    years: cloneDeep(yearsObject)
  }
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
  Preferred: LifecycleCosts;
  A: LifecycleCosts;
  B: LifecycleCosts;
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

  const hasLineItem = !!Object.values(estimatedLifecycleCost).find(
    phase => phase.isPresent
  );

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

  businessCase.lifecycleCostLines
    .filter((line: any) => !!line.cost)
    .forEach((line: any) => {
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
      const phase =
        lifecycleCostLines[line.solution as keyof lifecycleCostLinesType][
          phaseType
        ];
      phase.isPresent = true;
      phase.years[`year${line.year}` as keyof LifecycleYears] = line.cost
        ? line.cost.toString()
        : '';
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
      title: businessCase.preferredTitle || '',
      summary: businessCase.preferredSummary || '',
      acquisitionApproach: businessCase.preferredAcquisitionApproach || '',
      pros: businessCase.preferredPros || '',
      cons: businessCase.preferredCons || '',
      costSavings: businessCase.preferredCostSavings || '',
      estimatedLifecycleCost: lifecycleCostLines.Preferred || '',
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
      title: businessCase.alternativeATitle || '',
      summary: businessCase.alternativeASummary || '',
      acquisitionApproach: businessCase.alternativeAAcquisitionApproach || '',
      pros: businessCase.alternativeAPros || '',
      cons: businessCase.alternativeACons || '',
      costSavings: businessCase.alternativeACostSavings || '',
      estimatedLifecycleCost: lifecycleCostLines.A || '',
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

/** Array of lifecycle costs formatted for API */
const formatLifecycleCostsForApi = (
  lifecycleCosts: LifecycleCosts,
  solution: LifecycleSolution
): ApiLifecycleCostLine[] => {
  /** Array of lifecycle cost objects */
  const lifecycleCostsArray: CostData[] = Object.values(lifecycleCosts);

  // Reformat lifecycle costs for API and return as array
  return lifecycleCostsArray.reduce((acc, costData) => {
    const { label, years, isPresent } = costData;

    // Skip phases without any costs entered
    if (!isPresent) return acc;

    /** Phase label formatted for API */
    const phase: ApiLifecyclePhase =
      label === 'Other services, tools, and pilots' ? 'Other' : label;

    /** Array of costs for current phase */
    const currentPhaseCosts: string[] = Object.values(years);

    /** Current phase costs reformatted for API */
    const formattedLifecycleCosts: ApiLifecycleCostLine[] = currentPhaseCosts.map(
      (cost, index) => ({
        solution,
        phase,
        year: (index + 1).toString(),
        // If no cost entered, return 0
        cost: cost ? parseFloat(cost) : 0
      })
    );

    return [...acc, ...formattedLifecycleCosts];
  }, [] as ApiLifecycleCostLine[]);
};

export const prepareBusinessCaseForApi = (
  businessCase: BusinessCaseModel
): any => {
  const alternativeBExists = alternativeSolutionHasFilledFields(
    businessCase.alternativeB
  );

  const alternativeAExists = alternativeSolutionHasFilledFields(
    businessCase.alternativeA
  );

  /** Preferred, Alternative A, and Alternative B lifecycle costs formatted for API */
  const lifecycleCostLines: ApiLifecycleCostLine[] = [
    ...formatLifecycleCostsForApi(
      businessCase.preferredSolution.estimatedLifecycleCost,
      'Preferred'
    ),

    ...(alternativeAExists
      ? formatLifecycleCostsForApi(
          businessCase.alternativeA.estimatedLifecycleCost,
          'A'
        )
      : []),

    ...(alternativeBExists
      ? formatLifecycleCostsForApi(
          businessCase.alternativeB.estimatedLifecycleCost,
          'A'
        )
      : [])
  ];

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
