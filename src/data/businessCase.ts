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
  LifecyclePhaseKey,
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
    isPresent: true,
    type: 'primary',
    years: cloneDeep(yearsObject)
  },
  operationsMaintenance: {
    label: 'Operations and Maintenance',
    isPresent: true,
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
  createdAt: '',
  updatedAt: ''
};

type lifecycleCostLinesType = Record<LifecycleSolution, LifecycleCosts>;

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

  /** Whether requester has entered costs for required lifecycle cost categories */
  const hasRequiredPhaseCosts: boolean = !![
    ...Object.values(estimatedLifecycleCost.development.years),
    ...Object.values(estimatedLifecycleCost.operationsMaintenance.years)
  ].find(cost => !!cost);

  const hasRelatedCosts = !!Object.values(estimatedLifecycleCost).find(
    phase => phase.isPresent && phase.type === 'related'
  );

  return !!(
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
    hasRequiredPhaseCosts ||
    hasRelatedCosts
  );
};

const LifecyclePhaseMap: Record<ApiLifecyclePhase, LifecyclePhaseKey> = {
  Development: 'development',
  'Operations and Maintenance': 'operationsMaintenance',
  'Help desk/call center': 'helpDesk',
  'Software licenses': 'software',
  'Planning, support, and professional services': 'planning',
  Infrastructure: 'infrastructure',
  'OIT services, tools, and pilots': 'oit',
  Other: 'other'
};

export const prepareBusinessCaseForApp = (
  businessCase: any
): BusinessCaseModel => {
  /** Lifecycle costs from API */
  const lifecycleCosts: ApiLifecycleCostLine[] =
    businessCase.lifecycleCostLines;

  /** Default lifecycle costs object for app */
  const lifecycleCostLines: lifecycleCostLinesType = {
    Preferred: cloneDeep(defaultEstimatedLifecycle),
    A: cloneDeep(defaultEstimatedLifecycle),
    B: cloneDeep(defaultEstimatedLifecycle)
  };

  /** Merge lifecycle costs from api with default lifecycle costs */
  lifecycleCosts.forEach(line => {
    const { phase, solution } = line;

    const phaseKey = LifecyclePhaseMap[phase];

    /** Cost object for current phase */
    const costObject: CostData = lifecycleCostLines[solution][phaseKey];

    // Mark cost phase as `isPresent`
    costObject.isPresent = true;

    /** Cost converted to string */
    const cost: string = line?.cost === null ? '' : line?.cost.toString();

    // Set cost for correct year within cost object
    costObject.years[`year${line.year}` as keyof LifecycleYears] = cost;
  });

  return {
    id: businessCase.id,
    euaUserId: businessCase.euaUserId,
    status: businessCase.status,
    systemIntakeId: businessCase.systemIntakeId,
    requestName: businessCase.projectName || '',
    requester: {
      name: businessCase.requester || '',
      phoneNumber: businessCase.requesterPhoneNumber || ''
    },
    businessOwner: {
      name: businessCase.businessOwner || ''
    },
    businessNeed: businessCase.businessNeed || '',
    currentSolutionSummary: businessCase.currentSolutionSummary || '',
    cmsBenefit: businessCase.cmsBenefit || '',
    priorityAlignment: businessCase.priorityAlignment || '',
    successIndicators: businessCase.successIndicators || '',
    preferredSolution: {
      title: businessCase.preferredTitle || '',
      summary: businessCase.preferredSummary || '',
      acquisitionApproach: businessCase.preferredAcquisitionApproach || '',
      pros: businessCase.preferredPros || '',
      cons: businessCase.preferredCons || '',
      costSavings: businessCase.preferredCostSavings || '',
      estimatedLifecycleCost: lifecycleCostLines.Preferred,
      security: {
        isApproved: businessCase.preferredSecurityIsApproved,
        isBeingReviewed: businessCase.preferredSecurityIsBeingReviewed || ''
      },
      hosting: {
        type: businessCase.preferredHostingType || '',
        location: businessCase.preferredHostingLocation || '',
        cloudServiceType: businessCase.preferredHostingCloudServiceType || ''
      },
      hasUserInterface: businessCase.preferredHasUI || ''
    },
    alternativeA: {
      title: businessCase.alternativeATitle || '',
      summary: businessCase.alternativeASummary || '',
      acquisitionApproach: businessCase.alternativeAAcquisitionApproach || '',
      pros: businessCase.alternativeAPros || '',
      cons: businessCase.alternativeACons || '',
      costSavings: businessCase.alternativeACostSavings || '',
      estimatedLifecycleCost: lifecycleCostLines.A,
      security: {
        isApproved: businessCase.alternativeASecurityIsApproved,
        isBeingReviewed: businessCase.alternativeASecurityIsBeingReviewed
      },
      hosting: {
        type: businessCase.alternativeAHostingType || '',
        location: businessCase.alternativeAHostingLocation || '',
        cloudServiceType: businessCase.alternativeAHostingCloudServiceType || ''
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
    updatedAt: businessCase.updatedAt
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
        cost: cost ? parseFloat(cost) : null
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
          'B'
        )
      : [])
  ];

  // Return business case and convert empty strings to null for backend validation
  return {
    ...(businessCase.id && {
      id: businessCase.id
    }),
    ...(businessCase.euaUserId && {
      euaUserId: businessCase.euaUserId
    }),
    status: businessCase.status,
    systemIntakeId: businessCase.systemIntakeId,
    projectName: businessCase.requestName || null,
    requester: businessCase.requester.name || null,
    requesterPhoneNumber: businessCase.requester.phoneNumber || null,
    businessOwner: businessCase.businessOwner.name || null,
    businessNeed: businessCase.businessNeed || null,
    currentSolutionSummary: businessCase.currentSolutionSummary || null,
    cmsBenefit: businessCase.cmsBenefit || null,
    priorityAlignment: businessCase.priorityAlignment || null,
    successIndicators: businessCase.successIndicators || null,

    // Preferred solution
    preferredTitle: businessCase.preferredSolution.title || null,
    preferredSummary: businessCase.preferredSolution.summary || null,
    preferredAcquisitionApproach:
      businessCase.preferredSolution.acquisitionApproach || null,
    preferredSecurityIsApproved:
      businessCase.preferredSolution.security.isApproved,
    preferredSecurityisBeingReviewed:
      businessCase.preferredSolution.security.isBeingReviewed || null,
    preferredHostingType: businessCase.preferredSolution.hosting.type || null,
    preferredHostingLocation:
      businessCase.preferredSolution.hosting.location || null,
    preferredHostingCloudServiceType:
      businessCase.preferredSolution.hosting.cloudServiceType || null,
    preferredHasUI: businessCase.preferredSolution.hasUserInterface || null,
    preferredPros: businessCase.preferredSolution.pros || null,
    preferredCons: businessCase.preferredSolution.cons || null,
    preferredCostSavings: businessCase.preferredSolution.costSavings || null,

    // Alternative A
    alternativeATitle: businessCase.alternativeA.title || null,
    alternativeASummary: businessCase.alternativeA.summary || null,
    alternativeAAcquisitionApproach:
      businessCase.alternativeA.acquisitionApproach || null,
    alternativeASecurityIsApproved:
      businessCase.alternativeA.security.isApproved,
    alternativeASecurityisBeingReviewed:
      businessCase.alternativeA.security.isBeingReviewed || null,
    alternativeAHostingType: businessCase.alternativeA.hosting.type || null,
    alternativeAHostingLocation:
      businessCase.alternativeA.hosting.location || null,
    alternativeAHostingCloudServiceType:
      businessCase.alternativeA.hosting.cloudServiceType || null,
    alternativeAHasUI: businessCase.alternativeA.hasUserInterface || null,
    alternativeAPros: businessCase.alternativeA.pros || null,
    alternativeACons: businessCase.alternativeA.cons || null,
    alternativeACostSavings: businessCase.alternativeA.costSavings || null,

    // Alternative B
    alternativeBTitle: businessCase.alternativeB.title || null,
    alternativeBSummary: businessCase.alternativeB.summary || null,
    alternativeBAcquisitionApproach:
      businessCase.alternativeB.acquisitionApproach || null,
    alternativeBSecurityIsApproved:
      businessCase.alternativeB.security.isApproved || null,
    alternativeBSecurityisBeingReviewed:
      businessCase.alternativeB.security.isBeingReviewed || null,
    alternativeBHostingType: businessCase.alternativeB.hosting.type || null,
    alternativeBHostingLocation:
      businessCase.alternativeB.hosting.location || null,
    alternativeBHostingCloudServiceType:
      businessCase.alternativeB.hosting.cloudServiceType || null,
    alternativeBHasUI: businessCase.alternativeB.hasUserInterface || null,
    alternativeBPros: businessCase.alternativeB.pros || null,
    alternativeBCons: businessCase.alternativeB.cons || null,
    alternativeBCostSavings: businessCase.alternativeB.costSavings || null,
    lifecycleCostLines
  };
};

export const hostingTypeMap: any = {
  cloud: 'Yes, in the cloud (AWS, Azure, etc.)',
  dataCenter: 'Yes, at a data center',
  none: 'No, hosting is not needed'
};
