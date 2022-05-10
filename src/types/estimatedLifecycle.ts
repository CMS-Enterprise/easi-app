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
  year1: string;
  year2: string;
  year3: string;
  year4: string;
  year5: string;
};

export type CostData = {
  label: LifecyclePhases;
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
