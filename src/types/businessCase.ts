import { LifecyclePhase } from 'types/estimatedLifecycle';
import { DateTime } from 'luxon';

export type BusinessCaseSolution = {
  title: string;
  summary: string;
  pros: string;
  cons: string;
  estimatedLifecycleCost: {
    year1: LifecyclePhase[];
    year2: LifecyclePhase[];
    year3: LifecyclePhase[];
    year4: LifecyclePhase[];
    year5: LifecyclePhase[];
  };
  costSavings: string;
};

export type ProposedBusinessCaseSolution = BusinessCaseSolution & {
  acquisitionApproach: string;
};

// TODO: We can probably move this out and use it for System Intake too
// if the status types match.
type FormStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'REJECTED';
export type BusinessCaseModel = {
  id: string;
  status: FormStatus;
  requestName: string;
  requester: {
    name: string;
    phoneNumber: string;
  };
  businessOwner: {
    name: string;
  };
  businessNeed: string;
  cmsBenefit: string;
  priorityAlignment: string;
  successIndicators: string;
  asIsSolution: BusinessCaseSolution;
  preferredSolution: ProposedBusinessCaseSolution;
  alternativeA: ProposedBusinessCaseSolution;
  alternativeB?: ProposedBusinessCaseSolution;
};

export type BusinessCasesState = {
  businessCases: BusinessCaseModel[];
  isLoading: boolean | null;
  loadedTimestamp: DateTime | null;
  error: string | null;
};
