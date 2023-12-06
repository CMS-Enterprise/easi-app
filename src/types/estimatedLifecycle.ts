export type LifecyclePhase<
  otherType extends string = 'Other services, tools, and pilots'
> =
  | 'Development'
  | 'Operations and Maintenance'
  | 'Help desk/call center'
  | 'Software licenses'
  | 'Planning, support, and professional services'
  | 'Infrastructure'
  | 'OIT services, tools, and pilots'
  | otherType;

export type LifecycleYears = {
  year1: string;
  year2: string;
  year3: string;
  year4: string;
  year5: string;
};

export type CostData = {
  label: LifecyclePhase;
  isPresent: boolean;
  type: 'primary' | 'related';
  years: LifecycleYears;
};

export type LifecycleCosts = {
  development: CostData;
  operationsMaintenance: CostData;
  helpDesk: CostData;
  software: CostData;
  planning: CostData;
  infrastructure: CostData;
  oit: CostData;
  other: CostData;
};

export type LifecycleSolution = 'Preferred' | 'A' | 'B';

/** Lifecycle phases for API */
export type ApiLifecyclePhase = LifecyclePhase<'Other'>;

/** Lifecycle cost formatted for API */
export type ApiLifecycleCostLine = {
  solution: LifecycleSolution;
  phase: ApiLifecyclePhase;
  cost: number;
  year: string;
};
