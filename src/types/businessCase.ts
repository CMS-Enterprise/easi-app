import { LifecyclePhase } from 'types/estimatedLifecycle';

export type BidnessCaseSolution = {
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

export type ProposedBidnessCaseSolution = BidnessCaseSolution & {
  acquisitionApproach: string;
};

export type BidnessCaseModel = {
  requestName: string;
  requester: {
    name: string;
    phoneNumber: string;
  };
  bidnessOwner: {
    name: string;
  };
  bidnessNeed: string;
  cmsBenefit: string;
  priorityAlignment: string;
  successIndicators: string;
  asIsSolution: BidnessCaseSolution;
  preferredSolution: ProposedBidnessCaseSolution;
  alternativeA: ProposedBidnessCaseSolution;
  alternativeB?: ProposedBidnessCaseSolution;
};
