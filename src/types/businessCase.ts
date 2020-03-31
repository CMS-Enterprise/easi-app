import { LifecyclePhase } from 'types/estimatedLifecycle';

export type BusinessCaseModel = {
  projectName: string;
  requestor: {
    name: string;
    phoneNumber: string;
  };
  budgetNumber: string;
  businessOwner: {
    name: string;
  };
  businessNeed: string;
  cmsBenefit: string;
  priorityAlignment: string;
  successIndicators: string;
  asIsSolution: {
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
};
