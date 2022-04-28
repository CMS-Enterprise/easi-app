type costData = {
  isPresent: boolean;
  cost: string;
};

export type LifecycleCosts = {
  development: costData;
  operationsMaintenance: costData;
  helpDesk: costData;
  software: costData;
  planning: costData;
  infrastructure: costData;
  oit: costData;
  other: costData;
};
