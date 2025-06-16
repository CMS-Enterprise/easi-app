import { LifecycleCosts } from 'types/estimatedLifecycle';

// Base Solution
export type BusinessCaseSolution = {
  title: string;
  summary: string;
  pros: string;
  cons: string;
  estimatedLifecycleCost: LifecycleCosts;
  costSavings: string;
};

// Proposed Solution
export type ProposedBusinessCaseSolution = BusinessCaseSolution & {
  acquisitionApproach: string;
  targetContractAwardDate: string;
  targetCompletionDate: string;
  security: {
    isApproved: boolean | null;
    isBeingReviewed: string;
  };
  zeroTrustAlignment: string;
  hosting: {
    type: string;
    location: string;
    cloudStrategy: string;
    cloudServiceType?: string;
  };
  hasUserInterface: string;
  workforceTrainingReqs: string;
};

type BusinessCaseStatus = 'OPEN' | 'CLOSED';

export type GeneralRequestInfoForm = {
  requestName: string;
  projectAcronym: string;
  requester: {
    name: string;
    phoneNumber: string;
  };
  businessOwner: {
    name: string;
  };
};

export type RequestDescriptionForm = {
  businessNeed: string;
  collaborationNeeded: string;
  currentSolutionSummary: string;
  cmsBenefit: string;
  priorityAlignment: string;
  successIndicators: string;
  responseToGRTFeedback: string;
};

export type SolutionLabelType =
  | 'preferredSolution'
  | 'alternativeA'
  | 'alternativeB';

export type AlternativeAnalysisForm = {
  // proposedSolutions: ProposedBusinessCaseSolution[];
  preferredSolution: ProposedBusinessCaseSolution;
  alternativeA: ProposedBusinessCaseSolution;
  alternativeB: ProposedBusinessCaseSolution;
};

export type PreferredSolutionForm = {
  preferredSolution: ProposedBusinessCaseSolution;
};

export type AlternativeASolutionForm = {
  alternativeA: ProposedBusinessCaseSolution;
};

export type AlternativeBSolutionForm = {
  alternativeB: ProposedBusinessCaseSolution;
};

// Business Case Form Model
export type BusinessCaseModel = GeneralRequestInfoForm &
  RequestDescriptionForm &
  AlternativeAnalysisForm & {
    id?: string;
    euaUserId?: string;
    status: BusinessCaseStatus;
    systemIntakeId: string;
    createdAt: string;
    updatedAt: string;
  };

export type BusinessCasesState = {
  businessCases: BusinessCaseModel[];
  isLoading: boolean | null;
  loadedTimestamp: string | null;
  error: string | null;
};

// Redux store type for Business Case
export type BusinessCaseState = {
  form: BusinessCaseModel;
  isLoading: boolean | null;
  isSaving: boolean;
  error: any;
};
