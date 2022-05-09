export type LifecyclePhases =
  | 'Development'
  | 'Operations and Maintenance'
  | 'Help desk/call center'
  | 'Software licenses'
  | 'Planning, support, and professional services'
  | 'Infrastructure'
  | 'OIT services, tools, and pilots'
  | 'Other services, tools, and pilots';

export type LifecycleYears = {
  year1: number | null;
  year2: number | null;
  year3: number | null;
  year4: number | null;
  year5: number | null;
};

export type CostData = {
  phase: LifecyclePhases;
  isPresent: boolean;
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
